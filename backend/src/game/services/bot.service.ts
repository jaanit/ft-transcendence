import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game } from '../classes/game.class';
import { GameEndService } from './gameEnd.service';
import { Data } from '../interfaces/utils.interface';
import { GameSession } from './gameSession.service';

@Injectable()
export class BotService {
  constructor(
    private prisma: PrismaService,
    private gameEnd: GameEndService,
    private gameSessionService: GameSession,
  ) {}

  public async createBotGame(playerId: string, data: Data) {
    const game = await this.prisma.botGame.create({
      data: {
        user1_id: playerId,
        map: data.map,
        dimension: data.dimension,
        option: data.option,
      },
    });
    await this.prisma.users.update({
      where: {
        auth_id: playerId,
      },
      data: {
        status: 'inGame',
      },
    });
    const newgame = new Game();
    newgame.gameId = game.botGameId;
    newgame.playerId1 = playerId;
    newgame.playerAI = true;
    newgame.start = [false, true];
    this.gameSessionService.botGames[game.botGameId] = newgame;
    this.gameSessionService.playersInfo[playerId] = {
      type: 'Bot',
      id: String(game.botGameId),
    };
    return game;
  }

  public async deleteBotGame(game: Game) {
    if (!game || !(game.gameId in this.gameSessionService.botGames)) return;
    if (game.status === 'finished') {
      let theWinner = game.score.p1 > game.score.p2 ? game.playerId1 : 'Bot';
      await this.prisma.botGame.update({
        where: {
          botGameId: game.gameId,
        },
        data: {
          score1: game.score.p1,
          score2: game.score.p2,
          status: 'finished',
          winner: theWinner,
          time: new Date(),
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
      this.gameSessionService.playersSocket[game.playerId1].emit('gameEnd');
      delete this.gameSessionService.botGames[game.gameId];
      return;
    }
    await this.prisma.botGame.update({
      where: {
        botGameId: game.gameId,
      },
      data: {
        status: 'uncompleted',
        winner: 'Bot',
        score1: 1,
        score2: 10,
        time: new Date(),
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
    if (game.gameId in this.gameSessionService.botGames) {
      this.gameSessionService.playersSocket[game.playerId1].emit('gameEnd');
      delete this.gameSessionService.botGames[game.gameId];
    }
  }

  async rankBotUpdate(game: Game) {
	if (!game) return;
    const userRank = await this.prisma.stats.findUnique({
      where: {
        user_id: game.playerId1,
      },
    });
    let rankNew = userRank.leaderboard;
    const expected = Math.floor(1 / (1 + Math.pow(10, (rankNew - 1500) / 400)));
    rankNew = rankNew + ((game.winner === game.playerId1 ? 1 : 0) - expected);
    await this.prisma.stats.update({
      where: {
        user_id: game.playerId1,
      },
      data: {
        leaderboard: rankNew,
      },
    });
  }
}
