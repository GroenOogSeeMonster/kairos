import OpenAI from 'openai';
import { prisma } from './database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GoalSuggestion {
  title: string;
  description: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimatedDuration?: number;
}

export interface TaskSuggestion {
  title: string;
  description: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimatedDuration: number;
  dueDate?: Date;
}

export const generateGoalSuggestions = async (
  userInput: string,
  userId: string
): Promise<GoalSuggestion[]> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        goals: { where: { status: 'ACTIVE' } },
        tasks: { where: { status: 'PENDING' } },
      },
    });

    const context = `
User's current goals: ${user?.goals.map(g => g.title).join(', ') || 'None'}
User's pending tasks: ${user?.tasks.map(t => t.title).join(', ') || 'None'}
User input: ${userInput}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an AI productivity assistant. Based on the user's input and current goals/tasks, suggest 3-5 specific, actionable goals that would help them achieve their objectives. Each goal should be:
- Specific and measurable
- Realistic and achievable
- Aligned with their current priorities
- Include a category (work, personal, health, learning, etc.)
- Include a priority level (LOW, MEDIUM, HIGH, URGENT)
- Include estimated duration in minutes if applicable

Return the response as a JSON array of objects with the following structure:
[{
  "title": "Goal title",
  "description": "Detailed description",
  "category": "work|personal|health|learning",
  "priority": "LOW|MEDIUM|HIGH|URGENT",
  "estimatedDuration": 120
}]`,
        },
        {
          role: 'user',
          content: context,
        },
      ],
      temperature: 0.7,
    });

    const suggestions = JSON.parse(completion.choices[0].message.content || '[]');
    return suggestions;
  } catch (error) {
    console.error('Error generating goal suggestions:', error);
    throw new Error('Failed to generate goal suggestions');
  }
};

export const generateTaskSuggestions = async (
  goalId: string,
  userId: string
): Promise<TaskSuggestion[]> => {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId, userId },
      include: {
        tasks: { where: { status: 'PENDING' } },
      },
    });

    if (!goal) {
      throw new Error('Goal not found');
    }

    const context = `
Goal: ${goal.title}
Goal description: ${goal.description || 'No description'}
Current tasks for this goal: ${goal.tasks.map(t => t.title).join(', ') || 'None'}
Goal target date: ${goal.targetDate || 'No target date'}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an AI productivity assistant. Based on the goal and current tasks, suggest 5-8 specific, actionable tasks that would help achieve this goal. Each task should be:
- Specific and actionable
- Realistic and achievable
- Include a category (work, personal, health, learning, etc.)
- Include a priority level (LOW, MEDIUM, HIGH, URGENT)
- Include estimated duration in minutes
- Include a suggested due date if applicable

Return the response as a JSON array of objects with the following structure:
[{
  "title": "Task title",
  "description": "Detailed description",
  "category": "work|personal|health|learning",
  "priority": "LOW|MEDIUM|HIGH|URGENT",
  "estimatedDuration": 30,
  "dueDate": "2024-01-15T10:00:00Z"
}]`,
        },
        {
          role: 'user',
          content: context,
        },
      ],
      temperature: 0.7,
    });

    const suggestions = JSON.parse(completion.choices[0].message.content || '[]');
    return suggestions.map((suggestion: any) => ({
      ...suggestion,
      dueDate: suggestion.dueDate ? new Date(suggestion.dueDate) : undefined,
    }));
  } catch (error) {
    console.error('Error generating task suggestions:', error);
    throw new Error('Failed to generate task suggestions');
  }
};

export const prioritizeTasks = async (taskIds: string[], userId: string): Promise<string[]> => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        id: { in: taskIds },
        userId,
      },
    });

    const taskContext = tasks
      .map(task => `- ${task.title} (${task.priority}, due: ${task.dueDate || 'No due date'})`)
      .join('\n');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an AI productivity assistant. Given a list of tasks, prioritize them based on:
- Urgency (due dates)
- Importance (priority levels)
- Estimated duration
- Dependencies between tasks

Return the task IDs in order of priority (most important first) as a JSON array of strings.`,
        },
        {
          role: 'user',
          content: `Please prioritize these tasks:\n${taskContext}`,
        },
      ],
      temperature: 0.3,
    });

    const prioritizedIds = JSON.parse(completion.choices[0].message.content || '[]');
    return prioritizedIds;
  } catch (error) {
    console.error('Error prioritizing tasks:', error);
    // Fallback to original order if AI fails
    return taskIds;
  }
};

export const generateDailySchedule = async (
  userId: string,
  date: Date
): Promise<any[]> => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        status: 'PENDING',
        scheduledAt: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
      orderBy: { priority: 'desc' },
    });

    const calendarEvents = await prisma.calendarEvent.findMany({
      where: {
        userId,
        startTime: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
      orderBy: { startTime: 'asc' },
    });

    const context = `
Tasks for today: ${tasks.map(t => `${t.title} (${t.estimatedDuration || 30}min, ${t.priority})`).join(', ')}
Calendar events: ${calendarEvents.map(e => `${e.title} (${e.startTime.toTimeString()}-${e.endTime.toTimeString()})`).join(', ')}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an AI productivity assistant. Create an optimal daily schedule that:
- Fits all tasks around existing calendar events
- Prioritizes high-priority tasks
- Includes realistic time blocks
- Accounts for breaks and transitions
- Optimizes for productivity

Return the schedule as a JSON array of time blocks with the following structure:
[{
  "time": "09:00-10:30",
  "activity": "Task or event name",
  "type": "task|event|break",
  "priority": "LOW|MEDIUM|HIGH|URGENT"
}]`,
        },
        {
          role: 'user',
          content: context,
        },
      ],
      temperature: 0.5,
    });

    const schedule = JSON.parse(completion.choices[0].message.content || '[]');
    return schedule;
  } catch (error) {
    console.error('Error generating daily schedule:', error);
    throw new Error('Failed to generate daily schedule');
  }
};

export const generateReflectionPrompt = async (userId: string): Promise<string> => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const completedTasks = await prisma.task.findMany({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const pendingTasks = await prisma.task.findMany({
      where: {
        userId,
        status: 'PENDING',
        dueDate: {
          gte: startOfDay,
        },
      },
      take: 5,
    });

    const context = `
Completed tasks today: ${completedTasks.map(t => t.title).join(', ') || 'None'}
Upcoming tasks: ${pendingTasks.map(t => t.title).join(', ') || 'None'}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an AI productivity coach. Generate a thoughtful reflection prompt based on the user's daily activities. The prompt should:
- Acknowledge their accomplishments
- Encourage self-reflection
- Help them plan for tomorrow
- Be encouraging and positive
- Be specific to their day

Return only the reflection prompt as a string.`,
        },
        {
          role: 'user',
          content: context,
        },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content || 'How was your day? What would you like to accomplish tomorrow?';
  } catch (error) {
    console.error('Error generating reflection prompt:', error);
    return 'How was your day? What would you like to accomplish tomorrow?';
  }
}; 