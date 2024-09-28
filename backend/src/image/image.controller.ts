import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { ImageService } from './image.service';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('/v1/api/image')
export class ImageController {
  constructor(private ImageService: ImageService) {}

  @Get('/get/:id')
  @UseGuards(AuthGuard('jwt'))
  async getImg(@Res() res, @Param('id', ParseIntPipe) id: number) {
    const image = await this.ImageService.getImg(id);
    if (!image) res.status(404).send();
    res.setHeader('Content-Type', image.type); // Set the appropriate content type based on your image format
    res.send(Buffer.from(image.data));
  }

  @Post('/uploadPicture')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @UploadedFile() file: Multer.File,
    @Res() res,
    @Req() req,
  ) {
    try {
      const path = await this.ImageService.uploadImg(file);
      //   const path = await this.UserService.uploadProfilePicture(
      //     req.user.nickname,
      //     file,
      //   );
      return res.status(201).json({ path: path });
    } catch (error) {}
  }
}
