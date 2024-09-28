import { Injectable } from '@nestjs/common';
import { messageDto } from 'src/chat/dto/message.dto';
import { NotificationService } from 'src/notification/service/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private notification: NotificationService,
  ) {}
  async getMessages(group_id: number, auth_id: string) {
    return await this.prisma.message.findMany({
      where: {
        group_id: group_id,
        NOT: {
          sender: {
            auth_id: auth_id,
          },
        },
      },
      orderBy: {
        lastmodif: 'desc',
      },
    });
  }
  async createMessage(sender_id: string, messageDto: messageDto) {
    const message = await this.prisma.message.create({
      data: {
        message_text: messageDto.message,
        group_id: messageDto.groupId,
        sender_id,
      },
    });
    const group = await this.prisma.groups.update({
      where: {
        id: messageDto.groupId,
      },
      data: {
        lastChange: new Date(),
      },
    });
	if (!group) return;
    const members = await this.prisma.members.findMany({
      where: {
        group_id: messageDto.groupId,
        NOT: {
          user_id: sender_id,
        },
      },
    });
    members.map((member) => {
      this.notification.addNotification(sender_id, member.user_id, group.type + " message", '/chat/' + messageDto.groupId);
    });
  }
}
