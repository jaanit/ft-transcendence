import {
  Controller,
  Get,
  Req,
  Body,
  Res,
  Post,
  UseGuards,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameService } from './game.service';
import { AuthGuard } from '@nestjs/passport';
import { use } from 'passport';
import { JwtGuard } from 'src/auth/Guard/jwt.guard';

@Controller('/v1/api/Game')
@UseGuards(AuthGuard('jwt'))
export class GameController {
  constructor(private gameService: GameService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/getGame/:type/:id')
  async getGame(
    @Req() req,
    @Res() res,
    @Param('type') type: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (type === 'Bot') {
      const game = await this.gameService.getBotGame(id);
      if (game.user1_id !== req.user.auth_id)
        return res.status(401).json({ message: 'Unauthorized' });
      return res.status(200).json(game);
    }
    const game = await this.gameService.getDuoGame(id);
    if (game.user1_id !== req.user.auth_id && game.user2_id !== req.user.auth_id)
      return res.status(401).json({ message: 'Unauthorized' });
    return res.status(200).json(game);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/achievements')
  async getAchievements(@Req() req, @Res() res, @Query('nickname') nickname: string) {
	const achievements = await this.gameService.getAchievements(nickname);
	return res.status(200).json(achievements);
  }

}
