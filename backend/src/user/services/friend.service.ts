import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from 'src/notification/service/notification.service';

@Injectable()
export class FriendService {
  constructor(
    private prisma: PrismaService,
    private notification: NotificationService,
  ) {}

  async firendshipState(user1Id: string, user2Id: string) {
    if (user1Id === user2Id) throw new HttpException('invalid userId', 200);
    const block = await this.prisma.blockedUser.findFirst({
      where: {
        OR: [
          {
            blocked_id: user1Id,
            blocker_id: user2Id,
          },
          {
            blocked_id: user2Id,
            blocker_id: user1Id,
          },
        ],
      },
    });

    if (block) {
      if (block.blocked_id == user1Id)
        throw new HttpException({ type: 'blocked' }, 200);
      else throw new HttpException({ type: 'blocking' }, 200);
    }

    const existingFriendship = await this.prisma.friends.findFirst({
      where: {
        OR: [
          {
            user1_id: user1Id,
            user2_id: user2Id,
          },
          {
            user1_id: user2Id,
            user2_id: user1Id,
          },
        ],
      },
    });
    return existingFriendship;
  }

  async getFriendshiptype(user1Id: string, user2Id: string): Promise<string> {
    const existingFriendship = await this.firendshipState(user1Id, user2Id);
    if (!existingFriendship) return 'not friend';
    if (existingFriendship.status == 'accepted') return 'friend';
    if (existingFriendship.user1_id == user1Id) return 'pending';
    return 'waiting';
  }

  async addFriend(user1Id: string, user2Id: string): Promise<string> {
    const existingFriendship = await this.firendshipState(user1Id, user2Id);

    if (existingFriendship) {
      throw new HttpException('Friendship already exists.', 201);
    }
    const friends = await this.prisma.friends.create({
      data: {
        user1_id: user1Id,
        user2_id: user2Id,
        status: 'pending', // Set an initial status if needed
      },
      select: {
        user1: {
          select: {
            nickname: true,
          },
        },
      },
    });
    if (!friends) return;
    this.notification.addNotification(
      user1Id,
      user2Id,
      'friend Request',
      '/profile/' + friends.user1.nickname,
    ); // HERE
    return 'Friendship request sent successfully.';
  }

  async acceptFriend(user1Id: string, user2Id: string): Promise<string> {
    const friendship = await this.prisma.friends.findFirst({
      where: {
        user1_id: user2Id,
        user2_id: user1Id,
        status: 'pending',
      },
    });
    if (!friendship) {
      throw new HttpException("doesn't exist in friends waiting list", 400);
    }
    const friends = await this.prisma.friends.update({
      where: {
        friendship_id: friendship.friendship_id,
      },
      data: {
        status: 'accepted',
      },
      select: {
        user2: {
          select: {
            nickname: true,
          },
        },
      },
    });

    this.notification.addNotification(
      user1Id,
      user2Id,
      'friend accept',
      '/profile/' + friends.user2.nickname,
    ); // HERE
    return 'Friendship request accepted successfully.';
  }

  async deleteFriend(user1Id: string, user2Id: string): Promise<string> {
    const existingFriendship = await this.firendshipState(user1Id, user2Id);

    if (!existingFriendship) {
      throw new HttpException('Friendship request not found', 400);
    }

    const result = await this.prisma.friends.delete({
      where: {
        friendship_id: existingFriendship.friendship_id,
      },
    });

    return 'Friendship deleted successfully';
  }

  async getFriends(userId: string) {
    const Friends = await this.prisma.friends.findMany({
      where: {
        OR: [
          { user1_id: userId, status: 'accepted' },
          {
            user2_id: userId,
            status: 'accepted',
          },
        ],
      },
    });

    const friendIds = Friends.map((friendship) =>
      friendship.user1_id === userId
        ? friendship.user2_id
        : friendship.user1_id,
    );

    const friendDetails = await this.prisma.users.findMany({
      where: {
        auth_id: {
          in: friendIds,
        },
      },
    });
    return friendDetails;
  }
}
