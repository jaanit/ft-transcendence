import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';
import { NotificationService } from './notification/service/notification.service';
import { NotificationModule } from './notification/notification.module';
import { ImageModule } from './image/image.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    GameModule,
    ChatModule,
    NotificationModule,
    ImageModule
  ],
  providers:[PrismaService],

})
export class AppModule {}
