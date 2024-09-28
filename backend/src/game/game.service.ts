import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async getBotGame(id: number) {
    const game = await this.prisma.botGame.findUnique({
      where: {
        botGameId: id,
      },
	  select:{
		  botGameId: true,
		  user1_id: true,
		  map: true,
		  dimension: true,
		  option: true,
		  score1: true,
		  score2: true,
		  winner: true,
		  status: true,
		  time: true,
		  user1:{
			select:{
				nickname: true,
				picture: true,
			}
		  },
	  }
    });
    return game;
  }
  async getDuoGame(id: number) {
    const game = await this.prisma.game.findUnique({
      where: {
        gameId: id,
      },
	  select:{
		  gameId: true,
		  user1_id: true,
		  user2_id: true,
		  map: true,
		  dimension: true,
		  option: true,
		  score1: true,
		  score2: true,
		  winner: true,
		  status: true,
		  time: true,
		  user1:{
			select:{
				nickname: true,
				picture: true,
			}
		  },
		  user2:{
			select:{
				nickname: true,
				picture: true,
			}
		  }
	  }
    });
    return game;
  }

  async getAchievements(nickname: string) {
	const achievements = await this.prisma.users.findUnique({
	  where: {
		nickname: nickname,
	  },
	  select: {
		achievement: true,
	  }
	});
	return achievements;
  }
}
