import {
  Logger,
  OnModuleInit,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameSession, gameStatus } from '../services/gameSession.service';
import { Data, key } from '../interfaces/utils.interface';
import { JwtGuard } from 'src/auth/Guard/jwt.guard';
import { BotService } from '../services/bot.service';
import { MatchMakingService } from '../services/matchMaking.service';
import { GameEndService } from '../services/gameEnd.service';
import { AuthService } from 'src/auth/auth.service';
import { plainToClass } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationService } from 'src/notification/service/notification.service';

@WebSocketGateway({
  namespace: 'Game2d',
  cors: {
    credentials: true,
    origin: '*',
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private gameSessionService: GameSession,
    private botService: BotService,
    private matchMaking: MatchMakingService,
    private gameend: GameEndService,
    private authService: AuthService,
    private prisma: PrismaService,
    private notification: NotificationService,
  ) {}

  @WebSocketServer() server: Server;
  async afterInit(server: Server) {}

  @UseGuards(JwtGuard)
  @SubscribeMessage('joinQueue')
  async joinQueue(client: any, payload: Data) {
    const gametmp = this.gameSessionService.playersInfo[client.user];
    if (
      gametmp &&
      (gametmp.id in this.gameSessionService.matchPlayers ||
        gametmp.id in this.gameSessionService.botGames)
    ) {
      client.emit('ERROR', 'you are already in a game');
      return;
    }
    client.emit('startLoading');
    if (payload.mode === 'Bot') {
      const game = await this.botService.createBotGame(client.user, payload);
      client.emit('gameStart', '/Game/Bot/' + game.botGameId);
      return;
    }
    // TODO(): here a error need to be fixed
    if (payload.mode === 'Duo') {
      if (this.gameSessionService.queuePlayers.contains(client.user)) {
        this.gameSessionService.queuePlayers.erase(client.user);
      }
      const idx = this.gameSessionService.queuePlayers.containsData(payload);
      if (idx < 0) {
        await this.matchMaking.joinQueue(client.user, payload);
        return;
      }

      const userData = this.gameSessionService.queuePlayers.getDataByIdx(idx);
      const game = await this.matchMaking.createDuoGame(
        client.user,
        userData.item,
        payload,
      );
      this.gameSessionService.playersSocket[game.user1_id].emit(
        'gameStart',
        '/Game/Duo/' + game.gameId,
      );
      this.gameSessionService.playersSocket[game.user2_id].emit(
        'gameStart',
        '/Game/Duo/' + game.gameId,
      );
      return;
    }
    client.emit('ERROR', 'not implemented yet');
    return;
  }

  @UseGuards(JwtGuard)
  @SubscribeMessage('rejoin')
  async rejoin(client: any) {
    const gametmp = this.gameSessionService.playersInfo[client.user];
    if (
      !gametmp ||
      !(
        gametmp.id in this.gameSessionService.matchPlayers ||
        gametmp.id in this.gameSessionService.botGames
      )
    ) {
      client.emit('ERROR', 'you are not in a game');
      return;
    }
    client.emit('gameStart', '/Game/' + gametmp.type + '/' + gametmp.id);
    return;
  }

  //   TODO(): check for the game like bot
  @UseGuards(JwtGuard)
  @SubscribeMessage('gameReady')
  async gameReady(client: any, payload: { gameId: string; type: string }) {
    if (payload.type === 'Bot') {
      if (!(payload.gameId in this.gameSessionService.botGames)) {
        const game = this.gameSessionService.matchPlayers[payload.gameId];

        client.emit('ERROR', 'game not found');
        await this.botService.deleteBotGame(game);
        return;
      }
      this.gameSessionService.botGames[payload.gameId].start = [true, true];
    }
    if (payload.type === 'Duo') {
      const game = this.gameSessionService.matchPlayers[payload.gameId];
      this.gameSessionService.matchPlayers[payload.gameId].start = [
        game.playerId1 === client.user || game.start[0],
        game.playerId2 === client.user || game.start[1],
      ];
    }
  }

  @UseGuards(JwtGuard)
  @SubscribeMessage('cancel')
  async cancel(client: any) {
    this.gameSessionService.queuePlayers.erase(client.user);
    if (client.user in this.gameSessionService.inviteQueue) {
      this.notification.changeNotification(
        this.gameSessionService.inviteQueue[client.user].notification,
        'canceled',
      );
      if (
        this.gameSessionService.inviteQueue[client.user].payload.player in
        this.gameSessionService.playersSocket
      )
        this.gameSessionService.playersSocket[
          this.gameSessionService.inviteQueue[client.user].payload.player
        ].emit('notification');
      this.gameSessionService.inviteQueue.erase(client.user);
    }
    client.emit('cancelLoading');
    const gametmp = this.gameSessionService.playersInfo[client.user];
    if (gametmp) {
      if (gametmp.id in this.gameSessionService.botGames) {
        const gameStorage = this.gameSessionService.botGames[gametmp.id];
        await this.botService.deleteBotGame(gameStorage);
        return;
      }
      if (gametmp.id in this.gameSessionService.matchPlayers) {
        const gameStorage = this.gameSessionService.matchPlayers[gametmp.id];
        await this.matchMaking.deleteGameUncompleted(gameStorage, client.user);
      }
    }
  }

  @UseGuards(JwtGuard)
  @SubscribeMessage('keyGameUpdate')
  // TODO: add the type of game bot matchMaking invite
  async handelKeyGameUpdate(
    client: any,
    payload: { keys: key; gameId: string; type: string },
  ) {
    if (
      payload.type === 'Bot' &&
      payload.gameId in this.gameSessionService.botGames
    ) {
      this.gameSessionService.botGames[payload.gameId].check_keys(
        payload.keys,
        0,
      );
      this.gameSessionService.botGames[payload.gameId].update();
      if (
        this.gameSessionService.botGames[payload.gameId].status === 'finished'
      ) {
        const gameStorage = this.gameSessionService.botGames[payload.gameId];
        await this.botService.deleteBotGame(gameStorage);
        await this.botService.rankBotUpdate(gameStorage);
        return;
      }
      client.emit(
        'gameUpdate',
        this.gameSessionService.botGames[payload.gameId].get_data(0),
      );
    }

    if (
      payload.type === 'Duo' &&
      payload.gameId in this.gameSessionService.matchPlayers
    ) {
      const user = client.user;
      this.gameSessionService.matchPlayers[payload.gameId].check_keys(
        payload.keys,
        this.gameSessionService.matchPlayers[payload.gameId].playerId1 === user
          ? 0
          : 1,
      );
      this.gameSessionService.matchPlayers[payload.gameId].update();
      const game = this.gameSessionService.matchPlayers[payload.gameId];
      if (game.status === 'finished') {
        await this.matchMaking.deleteGame(game);
        return;
      }
      this.gameSessionService.playersSocket[game.playerId1].emit(
        'gameUpdate',
        game.get_data(game.playerId1 === user ? 0 : 1),
      );
      this.gameSessionService.playersSocket[game.playerId2].emit(
        'gameUpdate',
        game.get_data(game.playerId2 === user ? 0 : 1),
      );
    }
  }

  @UseGuards(JwtGuard)
  @SubscribeMessage('inviteGame')
  async inviteGame(client: any, payload: { player: string; data: Data }) {
    const user = client.user;
    this.cancel(client);
    client.emit('loadingFriendGame');
    this.gameSessionService.playersSocket[user] = client;
    const notification = await this.notification.addNotification(
      user,
      payload.player,
      'challenge',
      '',
    );
    this.gameSessionService.inviteQueue[user] = { payload, notification };
    if (payload.player in this.gameSessionService.playersSocket) {
      this.gameSessionService.playersSocket[payload.player].emit(
        'notification',
      );
    }
  }

  @UseGuards(JwtGuard)
  @SubscribeMessage('acceptGame')
  async acceptGame(client: any, payload: { challenger: string }) {
    if (payload.challenger in this.gameSessionService.inviteQueue) {
      this.notification.changeNotification(
        this.gameSessionService.inviteQueue[payload.challenger].notification,
        'accepted',
      );
      const userData = this.gameSessionService.inviteQueue[payload.challenger];
      this.gameSessionService.inviteQueue.erase(payload.challenger);
      const game = await this.matchMaking.createDuoGame(
        payload.challenger,
        client.user,
        userData.payload.data,
      );
      this.gameSessionService.playersSocket[game.user1_id].emit(
        'gameStart',
        '/Game/Duo/' + game.gameId,
      );
      this.gameSessionService.playersSocket[game.user2_id].emit(
        'gameStart',
        '/Game/Duo/' + game.gameId,
      );
    }
    client.emit('notification');
  }

  @UseGuards(JwtGuard)
  @SubscribeMessage('rejectGame')
  async rejectGame(client: any, payload: { challenger: string }) {
    if (payload.challenger in this.gameSessionService.inviteQueue) {
      this.notification.changeNotification(
        this.gameSessionService.inviteQueue[payload.challenger].notification,
        'canceled',
      );

      this.gameSessionService.inviteQueue.erase(payload.challenger);
      this.gameSessionService.playersSocket[payload.challenger].emit(
        'cancelLoading',
      );
    }
    client.emit('notification');
  }

  @UseGuards(JwtGuard)
  async handleConnection(client: any, ...args: any[]) {
    const token = this.authService.verifyToken(client.handshake.query.token);
    if (!token) return;
    const user = token.userId;
    if (!user) return;
    const status = await this.prisma.users.findUnique({
      where: {
        auth_id: user,
      },
    });
    if (status) {
      await this.prisma.users.update({
        where: {
          auth_id: user,
        },
        data: {
          status: 'online',
        },
      });
    }
    this.gameSessionService.playersSocket[user] = client;
  }

  @UseGuards(JwtGuard)
  async handleDisconnect(client: any) {
    const token = this.authService.verifyToken(client.handshake.query.token);
    if (!token) return;
    const user = token.userId;
    if (!user) return;
    const game = this.gameSessionService.playersInfo[user];
    if (game === undefined) {
      return;
    }
    if (game.type == 'Bot' && game.id in this.gameSessionService.botGames) {
      const gameStorage = this.gameSessionService.botGames[game.id];
      if (gameStorage.status === 'finished') {
        await this.botService.rankBotUpdate(gameStorage);
      }
      await this.botService.deleteBotGame(gameStorage);
    }

    if (game.type == 'Duo' && game.id in this.gameSessionService.matchPlayers) {
      const gameStorage = this.gameSessionService.matchPlayers[game.id];
      if (gameStorage.status === 'finished') {
        await this.matchMaking.rankDuoUpdate(game.id);
      }
      await this.matchMaking.deleteGameUncompleted(gameStorage, user);
    } else if (game.type == 'invite') {
      // await this.botGameService.deleteBotGame(client.id);
    }
    if (game.id in this.gameSessionService.playersInfo)
      delete this.gameSessionService.playersInfo[game.id];
    if (user in this.gameSessionService.playersSocket)
      delete this.gameSessionService.playersSocket[user];
    await this.prisma.users.update({
      where: {
        auth_id: user,
      },
      data: {
        status: 'offline',
      },
    });
  }
}
