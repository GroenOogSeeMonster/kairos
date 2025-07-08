import { prisma } from './database';
import { redisClient } from './redis';

export interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: 'REMINDER' | 'GOAL_UPDATE' | 'TASK_DUE' | 'REFLECTION' | 'SYSTEM';
  scheduledAt?: Date;
}

export const sendNotification = async (data: NotificationData) => {
  try {
    // Save notification to database
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        scheduledAt: data.scheduledAt,
        sentAt: new Date(),
      },
    });

    // Send push notification (if user has FCM token)
    await sendPushNotification(data);

    // Send email notification (if configured)
    await sendEmailNotification(data);

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

const sendPushNotification = async (data: NotificationData) => {
  try {
    // Get user's FCM token from Redis or database
    const fcmToken = await redisClient.get(`fcm_token:${data.userId}`);
    
    if (fcmToken) {
      // Here you would integrate with Firebase Cloud Messaging
      // For now, we'll just log the notification
      console.log(`Push notification sent to ${data.userId}: ${data.title}`);
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

const sendEmailNotification = async (data: NotificationData) => {
  try {
    // Get user email
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: { email: true, name: true },
    });

    if (user && process.env.SMTP_HOST) {
      // Here you would integrate with nodemailer
      // For now, we'll just log the email
      console.log(`Email notification sent to ${user.email}: ${data.title}`);
    }
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
};

export const markNotificationAsRead = async (notificationId: string, userId: string) => {
  return await prisma.notification.update({
    where: {
      id: notificationId,
      userId: userId,
    },
    data: {
      isRead: true,
    },
  });
};

export const getUserNotifications = async (userId: string, limit = 20) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
};

export const getUnreadNotifications = async (userId: string) => {
  return await prisma.notification.findMany({
    where: {
      userId,
      isRead: false,
    },
    orderBy: { createdAt: 'desc' },
  });
}; 