import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Queue } from '../classes/queue.class';
import { Game } from '../classes/game.class';
import { Data } from '../interfaces/utils.interface';
import { GameSession } from './gameSession.service';
import { GameEndService } from './gameEnd.service';

@Injectable()
export class MatchMakingService {
  constructor(
    private prisma: PrismaService,
    private gameSessionService: GameSession,
    private gameend: GameEndService,
  ) {}

  public async joinQueue(gameId: string, data: Data) {
    this.gameSessionService.queuePlayers.enqueue(gameId, data);
  }

  async createDuoGame(user1: string, user2: string, data: Data) {
    const newGame = new Game();
    const game = await this.prisma.game.create({
      data: {
        user1_id: user1,
        user2_id: user2,
        map: data.map,
        dimension: data.dimension,
        option: data.option,
      },
    });
    await this.prisma.users.update({
      where: {
        auth_id: user1,
      },
      data: {
        status: 'inGame',
      },
    });
    await this.prisma.users.update({
      where: {
        auth_id: user2,
      },
      data: {
        status: 'inGame',
      },
    });
    newGame.gameId = game.gameId;
    newGame.playerId1 = user1;
    newGame.playerId2 = user2;
    newGame.playerAI = false;
    // newGame.status = 'notStarted';
    newGame.time = new Date();
    newGame.start = [false, false];
    this.gameSessionService.matchPlayers[game.gameId] = newGame;
    this.gameSessionService.playersInfo[user1] = {
      type: 'Duo',
      id: String(game.gameId),
    };
    this.gameSessionService.playersInfo[user2] = {
      type: 'Duo',
      id: String(game.gameId),
    };
    return game;
  }

  async deleteGame(game: Game) {
    if (!game || !(game.gameId in this.gameSessionService.matchPlayers)) return;
    if (game.status === 'finished') {
      delete this.gameSessionService.matchPlayers[game.gameId];
      const user1 = game.playerId1;
      const user2 = game.playerId2;
      const winner = game.score.p1 > game.score.p2 ? user1 : user2;
      await this.prisma.game.update({
        where: {
          gameId: game.gameId,
        },
        data: {
          score1: game.score.p1,
          score2: game.score.p2,
          status: 'finished',
          winner: winner,
          time: new Date(),
        },
      });
      await this.prisma.users.update({
        where: {
          auth_id: user1,
        },
        data: {
          status: 'online',
        },
      });
      await this.prisma.users.update({
        where: {
          auth_id: user2,
        },
        data: {
          status: 'online',
        },
      });
      this.gameSessionService.playersSocket[game.playerId1].emit('gameEnd');
      this.gameSessionService.playersSocket[game.playerId2].emit('gameEnd');
      await this.rankDuoUpdate(String(game.gameId));
      return;
    }
  }

  async deleteGameUncompleted(game: Game, loser: string) {
    if (!game || !(game.gameId in this.gameSessionService.matchPlayers)) return;
    delete this.gameSessionService.matchPlayers[game.gameId];
    await this.prisma.game.update({
      where: {
        gameId: game.gameId,
      },
      data: {
        status: 'uncompleted',
        winner: game.playerId1 === loser ? game.playerId2 : game.playerId1,
        score1: game.playerId1 === loser ? 1 : 10,
        score2: game.playerId1 === loser ? 10 : 1,
      },
    });
    await this.prisma.users.update({
      where: {
        auth_id: game.playerId1,
      },
      data: {
        status: 'online',
      },
    });
    await this.prisma.users.update({
      where: {
        auth_id: game.playerId2,
      },
      data: {
        status: 'online',
      },
    });
    if (game.gameId in this.gameSessionService.matchPlayers) {
      this.gameSessionService.playersSocket[game.playerId1]?.emit('gameEnd');
      this.gameSessionService.playersSocket[game.playerId2]?.emit('gameEnd');
    }
  }

  async calculateRank(
    user1: {
      leaderboard: number;
      user_id: string;
      points: number;
      wins: number;
      losses: number;
      goal_conceded: number;
      goal_scoared: number;
      clean_sheets: number;
    },
    user2: {
      leaderboard: number;
      user_id: string;
      points: number;
      wins: number;
      losses: number;
      goal_conceded: number;
      goal_scoared: number;
      clean_sheets: number;
    },
    game: { winner: string; score1: number; score2: number },
    score1: number,
    score2: number,
  ) {
    let rank1 = user1.leaderboard;
    let rank2 = user2.leaderboard;
    const expected1 = 1 / (1 + Math.pow(10, (rank1 - rank2) / 400));
    rank1 = Math.floor(
      rank1 + ((game.winner === user1.user_id ? 1 : 0) - expected1) * 100,
    );
    return await this.prisma.stats.update({
      where: {
        user_id: user1.user_id,
      },
      data: {
        leaderboard: rank1,
        wins: game.winner === user1.user_id ? user1.wins + 1 : user1.wins,
        losses: game.winner === user1.user_id ? user1.losses : user1.losses + 1,
        goal_conceded: user1.goal_conceded + score2,
        goal_scoared: user1.goal_scoared + score1,
        clean_sheets:
          score2 === 0 ? user1.clean_sheets + 1 : user1.clean_sheets,
        points:
          (game.winner === user1.user_id
            ? 5 * Math.abs(score1 - score2)
            : 0) +
          user1.points +
          10,
      },
    });
  }

  async rankDuoUpdate(gameId: string) {
    const game = await this.prisma.game.findUnique({
      where: {
        gameId: Number(gameId),
      },
    });
    const user1 = await this.prisma.stats.findUnique({
      where: {
        user_id: game.user1_id,
      },
    });
    const user2 = await this.prisma.stats.findUnique({
      where: {
        user_id: game.user2_id,
      },
    });
    const rank1 = await this.calculateRank(
      user1,
      user2,
      game,
      game.score1,
      game.score2,
    );
    const rank2 = await this.calculateRank(
      user2,
      user1,
      game,
      game.score2,
      game.score1,
    );
    await this.achivementUpdate(rank1);
    await this.achivementUpdate(rank2);
  }

  async achivementUpdate(user: any) {
    await this.rank1(user);
    await this.rank2(user);
    await this.rank3(user);
    await this.genius(user);
    await this.level3(user);
    await this.level5(user);
    await this.level10(user);
  }

  async rank1(user: any) {
    if (user.goal_scoared >= 100) {
      const goals = await this.prisma.achievement.findFirst({
        where: {
          user_id: user.user_id,
          name: 'Rank_1',
        },
      });
      if (!goals) {
        await this.prisma.achievement.create({
          data: {
            user_id: user.user_id,
            name: 'Rank_1',
            description: 'Score 100 goals',
            level: 0,
            goal_scoared: 1,
            clean_sheets: 0,
          },
        });
      }
    }
  }

  async rank2(user: any) {
    if (user.goal_scoared >= 200) {
      const goals = await this.prisma.achievement.findFirst({
        where: {
          user_id: user.user_id,
          name: 'Rank_2',
        },
      });
      if (!goals) {
        await this.prisma.achievement.create({
          data: {
            user_id: user.user_id,
            name: 'Rank_2',
            description: 'Score 200 goals',
            level: 0,
            goal_scoared: 1,
            clean_sheets: 0,
          },
        });
      }
    }
  }

  async rank3(user: any) {
    if (user.goal_scoared >= 300) {
      const goals = await this.prisma.achievement.findFirst({
        where: {
          user_id: user.user_id,
          name: 'Rank_3',
        },
      });
      if (!goals) {
        await this.prisma.achievement.create({
          data: {
            user_id: user.user_id,
            name: 'Rank_3',
            description: 'Score 300 goals',
            level: 0,
            goal_scoared: 1,
            clean_sheets: 0,
          },
        });
      }
    }
  }

  async genius(user: any) {
    if (user.clean_sheets === 1) {
      const goals = await this.prisma.achievement.findFirst({
        where: {
          user_id: user.user_id,
          name: 'Genius',
        },
      });
      if (!goals) {
        await this.prisma.achievement.create({
          data: {
            user_id: user.user_id,
            name: 'Genius',
            description: 'Clean sheet',
            level: 0,
            goal_scoared: 0,
            clean_sheets: 1,
          },
        });
      }
    }
  }

  async level3(user: any) {
    if (user.points >= 300) {
      const goals = await this.prisma.achievement.findFirst({
        where: {
          user_id: user.user_id,
          name: 'Level_3',
        },
      });
      if (!goals) {
        await this.prisma.achievement.create({
          data: {
            user_id: user.user_id,
            name: 'Level_3',
            description: 'Level 3',
            level: 1,
            goal_scoared: 0,
            clean_sheets: 0,
          },
        });
      }
    }
  }

  async level5(user: any) {
    if (user.points >= 500) {
      const goals = await this.prisma.achievement.findFirst({
        where: {
          user_id: user.user_id,
          name: 'Level_5',
        },
      });
      if (!goals) {
        await this.prisma.achievement.create({
          data: {
            user_id: user.user_id,
            name: 'Level_5',
            description: 'Level 5',
            level: 1,
            goal_scoared: 0,
            clean_sheets: 0,
          },
        });
      }
    }
  }

  async level10(user: any) {
    if (user.points >= 1000) {
      const goals = await this.prisma.achievement.findFirst({
        where: {
          user_id: user.user_id,
          name: 'Level_10',
        },
      });
      if (!goals) {
        await this.prisma.achievement.create({
          data: {
            user_id: user.user_id,
            name: 'Level_10',
            description: 'Level 10',
            level: 1,
            goal_scoared: 0,
            clean_sheets: 0,
          },
        });
      }
    }
  }
}
