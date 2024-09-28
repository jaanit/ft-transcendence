import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}
  async getNotifications(auth_id: string) {
    return await this.prisma.notification.findMany({
      where: {
        receiver_id: auth_id,
      },
      orderBy: {
        last_change: 'desc',
      },
      select: {
        type: true,
        seen: true,
        path: true,
        last_change: true,
        Source: {
          select: {
            auth_id: true,
            nickname: true,
            picture: true,
          },
        },
      },
    });
  }
  async seenAllNotification(auth_id: string) {
    await this.prisma.notification.updateMany({
      where: {
        receiver_id: auth_id,
      },
      data: {
        seen: true,
      },
    });
  }
  async addNotification(
    sender_id: string,
    receiver_id: string,
    type: string,
    path: string,
  ) {
    const user = await this.prisma.users.findUnique({
      where: {
        auth_id: sender_id,
      },
    });
    const user2 = await this.prisma.users.findUnique({
      where: {
        auth_id: receiver_id,
      },
    });
    if (!user || !user2) return;
    const notification = await this.prisma.notification.create({
      data: {
        type,
        sender_id,
        receiver_id,
        path,
      },
    });
    return notification.notification_id;
  }

  async changeNotification(id: number, path: string) {
    const user = await this.prisma.notification.findUnique({
      where: {
        notification_id: id,
      },
    });
    if (!user) return;
    return await this.prisma.notification.updateMany({
      where: {
        notification_id: id,
      },
      data: {
        path: path,
      },
    });
  }
}
