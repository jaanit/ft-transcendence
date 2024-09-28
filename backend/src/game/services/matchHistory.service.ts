import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class MatchHistoryService {
  constructor(
    private prisma: PrismaService,
    private UserService: UserService,
  ) {}

  async getMatchHistory(auth_id: string) {
    return await this.prisma.game.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                user1_id: auth_id,
              },
              {
                user2_id: auth_id,
              },
            ],
          },
          {
            status: 'finished',
          },
        ],
      },
      orderBy: {
        time: 'desc',
      },
      select: {
        score1: true,
        score2: true,
        winner: true,
        user1: {
          select: {
            auth_id: true,
            nickname: true,
            picture: true,
          },
        },
        user2: {
          select: {
            auth_id: true,
            nickname: true,
            picture: true,
          },
        },
      },
    });
  }

  async getMyRank(auth_id: string) {
    const users = await this.UserService.getUsersByRank();
    const index = users.findIndex((user) => {
      return user.user.auth_id === auth_id;
    });
    return index;
  }

  async getStats(auth_id: string, user2: string) {
    const games = await this.prisma.game.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                user1_id: auth_id,
              },
              {
                user2_id: auth_id,
              },
            ],
          },
          {
            status: 'finished',
          },
        ],
      },
      select: {
        score1: true,
        score2: true,
        winner: true,
        user1_id: true,
      },
    });
    const win = games.filter(game => {
      return game.winner == auth_id;

    }).length;
    const loss = games.filter(game => {
      return game.winner == user2;
    }).length;

    let my_goal = 0,
      opp_goal = 0;
    games.forEach((game) => {
      if (game.user1_id === auth_id) {
        my_goal += game.score1;
        opp_goal += game.score2;
      } else {
        my_goal += game.score2;
        opp_goal += game.score1;
      }
    });
    const my_rank = await this.getMyRank(auth_id) + 1;
    const opp_rank = await this.getMyRank(user2) + 1;
    return {
      my_rank,
      opp_rank,
      opp_goal,
      my_goal,
      win,
      loss,
    };
  }

  async getMatchHistoryGlobal() {
    return await this.prisma.game.findMany({
      where: {
        status: 'finished',
      },
      orderBy: {
        time: 'desc',
      },
      select: {
        score1: true,
        score2: true,
        winner: true,
        user1: {
          select: {
            auth_id: true,
            nickname: true,
            picture: true,
          },
        },
        user2: {
          select: {
            auth_id: true,
            nickname: true,
            picture: true,
          },
        },
      },
    });
  }

  async getUserByGameId(id: string) {
    return await this.prisma.users.findUnique({
      where: {
        auth_id: id,
      },
    });
  }
}
