import cron from 'node-cron';
import { prisma } from './database';
import { redisClient } from './redis';
import { sendNotification } from './notification';

export const initializeScheduler = async () => {
  // Morning briefing - every day at 7 AM
  cron.schedule('0 7 * * *', async () => {
    try {
      console.log('Running morning briefing scheduler...');
      await sendMorningBriefings();
    } catch (error) {
      console.error('Morning briefing scheduler error:', error);
    }
  });

  // Evening reflection reminder - every day at 8 PM
  cron.schedule('0 20 * * *', async () => {
    try {
      console.log('Running evening reflection reminder...');
      await sendEveningReminders();
    } catch (error) {
      console.error('Evening reminder scheduler error:', error);
    }
  });

  // Weekly progress summary - every Sunday at 9 AM
  cron.schedule('0 9 * * 0', async () => {
    try {
      console.log('Running weekly progress summary...');
      await sendWeeklySummaries();
    } catch (error) {
      console.error('Weekly summary scheduler error:', error);
    }
  });

  // Task due reminders - every hour
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Running task due reminders...');
      await sendTaskDueReminders();
    } catch (error) {
      console.error('Task reminder scheduler error:', error);
    }
  });

  console.log('Scheduler initialized successfully');
};

const sendMorningBriefings = async () => {
  const users = await prisma.user.findMany({
    where: { isOnboarded: true },
    include: {
      tasks: {
        where: {
          status: 'PENDING',
          scheduledAt: {
            gte: new Date(),
            lt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next 24 hours
          },
        },
        orderBy: { priority: 'desc' },
        take: 5,
      },
    },
  });

  for (const user of users) {
    if (user.tasks.length > 0) {
      const taskList = user.tasks
        .map((task, index) => `${index + 1}. ${task.title}`)
        .join('\n');

      await sendNotification({
        userId: user.id,
        title: '🌅 Good Morning! Your Daily Priorities',
        message: `Here are your top priorities for today:\n\n${taskList}\n\nHave a productive day!`,
        type: 'REMINDER',
      });
    }
  }
};

const sendEveningReminders = async () => {
  const users = await prisma.user.findMany({
    where: { isOnboarded: true },
  });

  for (const user of users) {
    await sendNotification({
      userId: user.id,
      title: '🌙 Evening Reflection Time',
      message: 'Take a moment to reflect on your day and plan for tomorrow. How did you do?',
      type: 'REFLECTION',
    });
  }
};

const sendWeeklySummaries = async () => {
  const users = await prisma.user.findMany({
    where: { isOnboarded: true },
    include: {
      tasks: {
        where: {
          completedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      },
      goals: {
        where: { status: 'ACTIVE' },
      },
    },
  });

  for (const user of users) {
    const completedTasks = user.tasks.length;
    const activeGoals = user.goals.length;

    await sendNotification({
      userId: user.id,
      title: '📊 Your Weekly Progress Summary',
      message: `This week you completed ${completedTasks} tasks and have ${activeGoals} active goals. Keep up the great work!`,
      type: 'SYSTEM',
    });
  }
};

const sendTaskDueReminders = async () => {
  const now = new Date();
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

  const dueTasks = await prisma.task.findMany({
    where: {
      status: 'PENDING',
      dueDate: {
        gte: now,
        lte: oneHourFromNow,
      },
    },
    include: { user: true },
  });

  for (const task of dueTasks) {
    await sendNotification({
      userId: task.userId,
      title: '⏰ Task Due Soon',
      message: `"${task.title}" is due soon. Don't forget to complete it!`,
      type: 'TASK_DUE',
    });
  }
}; 