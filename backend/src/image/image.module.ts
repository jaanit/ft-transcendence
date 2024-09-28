import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [ImageController],
    providers: [ImageService, PrismaService],
    exports: [ImageService]
})
export class ImageModule {};