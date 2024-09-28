import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './gateway/game.gateway';
import { GameSession } from './services/gameSession.service';
import { JwtGuard } from 'src/auth/Guard/jwt.guard';
import { AuthService } from 'src/auth/auth.service';
import { BotService } from './services/bot.service';
import { MatchMakingService } from './services/matchMaking.service';
import { ImageService } from 'src/image/image.service';
import { GameEndService } from './services/gameEnd.service';
import { MatchHistoryService } from './services/matchHistory.service';
import { UserService } from 'src/user/services/user.service';
import { GameMatchController } from './controllers/gamematch.controller';
import { NotificationService } from 'src/notification/service/notification.service';

@Module({
  controllers: [GameController, GameMatchController],
  providers: [
    PrismaService,
    GameService,
    GameGateway,
    GameSession,
    AuthService,
    BotService,
    MatchMakingService,
    ImageService,
	  GameEndService,
	  MatchHistoryService,
    UserService,
    NotificationService
  ],
})
export class GameModule {}
