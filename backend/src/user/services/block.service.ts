import { Injectable, HttpException, Delete } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FriendService } from './friend.service';
import { DuoService } from '../../chat/services/chats/chats.service';

@Injectable()
export class BlockService {
  constructor(
    private prisma: PrismaService,
    private FriendService: FriendService,
    private DuoService:DuoService,
  ) {}
  async unblockUser(
    blockedUserId: string,
    blockerUserId: string,
  ): Promise<string> {
    try {
      const existingBlock = await this.prisma.blockedUser.findFirst({
        where: {
          blocked_id: blockedUserId,
          blocker_id: blockerUserId,
        },
      });

      if (!existingBlock) {
        return 'User is not blocked.';
      }

      await this.prisma.blockedUser.delete({
        where: {
          block_id: existingBlock.block_id,
        },
      });
      await this.DuoService.unblock(blockerUserId, blockedUserId)
      return 'User deblocked successfully.';
    } catch (error) {
      return 'An error occurred while deblocking the user.';
    }
  }
  async blockUser(
    blockedUserId: string,
    blockerUserId: string,
    ): Promise<string> {
      const existingBlock = await this.prisma.blockedUser.findFirst({
        where: {
          OR: [
            {
              blocked_id: blockedUserId,
              blocker_id: blockerUserId,
            },
            {
              blocked_id: blockerUserId,
              blocker_id: blockedUserId,
            },
          ],
        },
      });
      await this.DuoService.block(blockerUserId, blockedUserId)
      if (existingBlock) {
        return 'User is already blocked!';
      }
      try {
        await this.FriendService.deleteFriend(blockedUserId, blockerUserId);
      } catch (err) {}
      await this.prisma.blockedUser.create({
        data: {
          blocked_id: blockedUserId,
          blocker_id: blockerUserId,
        },
      });
      return 'User blocked successfully.';
    }
  }