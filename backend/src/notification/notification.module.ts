import { Module } from '@nestjs/common';
import { NotificationController } from './controller/notification.controller';
import { NotificationService } from './service/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [NotificationController],
    providers: [NotificationService, PrismaService],
    exports: [NotificationService]
})
export class NotificationModule {};