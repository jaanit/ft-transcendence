import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Game } from "../classes/game.class";
import { type } from "os";
import { GameSession } from "./gameSession.service";

@Injectable()
export class GameEndService {
	constructor(private prisma: PrismaService, private gameSessionService: GameSession) {}

	// async rankDuoUpdate(gameId: string) {
	// 	const game = await this.prisma.game.findUnique({
	// 		where: {
	// 			gameId: Number(gameId),
	// 		},
	// 	})
	// 	const user1 = await this.prisma.stats.findUnique({
	// 		where: {
	// 			user_id: game.user1_id
	// 		},
	// 	});
	// 	const user2 = await this.prisma.stats.findUnique({
	// 		where: {
	// 			user_id: game.user2_id
	// 		},
	// 	});
	// 	let rank1 = user1.leaderboard;
	// 	let rank2 = user2.leaderboard;
	// 	const expected1 = (1 / (1 + Math.pow(10, (rank1 - rank2) / 400)));
	// 	const expected2 = (1 / (1 + Math.pow(10, (rank2 - rank1) / 400)));
	// 	rank1 = Math.floor(rank1 + ((game.winner === user1.user_id ? 1 : 0) - expected1) *100);
	// 	rank2 = Math.floor(rank2 + ((game.winner === user2.user_id ? 1 : 0) - expected2) * 100);
	// 	await this.prisma.stats.update({
	// 		where: {
	// 			user_id: user1.user_id
	// 		},
	// 		data: {
	// 			leaderboard: rank1,
	// 			wins: game.winner === user1.user_id ? user1.wins + 1 : user1.wins,
	// 			losses: game.winner === user1.user_id ? user1.losses : user1.losses + 1,
	// 			goal_conceded: user1.goal_conceded + game.score2,
	// 			goal_scoared: user1.goal_scoared + game.score1,
	// 			clean_sheets: game.score2 === 0 ? user1.clean_sheets + 1 : user1.clean_sheets,
	// 			points: (game.winner === user1.user_id ? (5 * Math.abs(game.score1 - game.score2)) : 0) + user1.points + 10,
	// 		}
	// 	});
	// 	await this.prisma.stats.update({
	// 		where: {
	// 			user_id: user2.user_id
	// 		},
	// 		data: {
	// 			leaderboard: rank2,
	// 			wins: game.winner === user2.user_id ? user2.wins + 1 : user2.wins,
	// 			losses: game.winner === user2.user_id ? user2.losses : user2.losses + 1,
	// 			goal_conceded: user2.goal_conceded + game.score1,
	// 			goal_scoared: user2.goal_scoared + game.score2,
	// 			clean_sheets: game.score1 === 0 ? user2.clean_sheets + 1 : user2.clean_sheets,
	// 			points: (game.winner === user2.user_id ? (5 * Math.abs(game.score1 - game.score2)) : 0) + user2.points + 10,
	// 		}
	// 	});
	// 	user1.leaderboard = rank1;
	// 	user1.wins = game.winner === user1.user_id ? user1.wins + 1 : user1.wins;
	// 	user1.losses = game.winner === user1.user_id ? user1.losses : user1.losses + 1;
	// 	user1.goal_conceded = user1.goal_conceded + game.score2;
	// 	user1.goal_scoared = user1.goal_scoared + game.score1;
	// 	user1.clean_sheets = (game.score1 === 10 && game.score2 === 0) ? user1.clean_sheets + 1 : user1.clean_sheets;
	// 	user1.points = (game.winner === user1.user_id ? (5 * Math.abs(game.score1 - game.score2)) : 0) + user1.points + 10 ;
		
	// 	user2.leaderboard = rank2;
	// 	user2.wins = game.winner === user2.user_id ? user2.wins + 1 : user2.wins;
	// 	user2.losses = game.winner === user2.user_id ? user2.losses : user2.losses + 1;
	// 	user2.goal_conceded = user2.goal_conceded + game.score1;
	// 	user2.goal_scoared = user2.goal_scoared + game.score2;
	// 	user2.clean_sheets = (game.score2 === 10 && game.score1 === 0) ? user2.clean_sheets + 1 : user2.clean_sheets;
	// 	user2.points = (game.winner === user2.user_id ? (5 * Math.abs(game.score1 - game.score2)) : 0) + user2.points + 10;
		
	// 	await this.achivementUpdate(user1);
	// 	await this.achivementUpdate(user2);
	// }

	// async achivementUpdate(user: any) {
	// 	let achiv :{
	// 		name: string
	// 		description: string
	// 		level: number,
	// 		goal_scoared: number,
	// 		clean_sheets: number,
	// 	}[] = [];
	// 	// goals
	// 	if (user.goal_scoared === 100){
	// 		achiv.push({
	// 			name: '100 goals',
	// 			description: 'score 100 goals',
	// 			level: 0,
	// 			goal_scoared: 1,
	// 			clean_sheets: 0,
	// 		});
	// 	} else if (user.goal_scoared === 200){
	// 		achiv.push({
	// 			name: '200 goals',
	// 			description: 'score 200 goals',
	// 			level: 0,
	// 			goal_scoared: 1,
	// 			clean_sheets: 0,
	// 		});
	// 	} else if (user.goal_scoared === 300){
	// 		achiv.push({
	// 			name: '300 goals',
	// 			description: 'score 300 goals',
	// 			level: 0,
	// 			goal_scoared: 1,
	// 			clean_sheets: 0,
	// 		});
	// 	}
	// 	// clean sheet
	// 	if (user.clean_sheets === 1){
	// 		achiv.push({
	// 			name: '1 clean sheet',
	// 			description: 'get 1 clean sheet',
	// 			level: 0,
	// 			goal_scoared: 0,
	// 			clean_sheets: 1,
	// 		});
	// 	}
	// 	// level
	// 	if (user.points === 300){
	// 		achiv.push({
	// 			name: 'level 3',
	// 			description: 'get 3 level',
	// 			level: 1,
	// 			goal_scoared: 0,
	// 			clean_sheets: 0,
	// 		});
	// 	}
	// 	else if (user.points === 500){
	// 		achiv.push({
	// 			name: 'level 5',
	// 			description: 'get 5 level',
	// 			level: 1,
	// 			goal_scoared: 0,
	// 			clean_sheets: 0,
	// 		});
	// 	}
	// 	else if (user.points === 1000){
	// 		achiv.push({
	// 			name: 'level 10',
	// 			description: 'get 10 level',
	// 			level: 1,
	// 			goal_scoared: 0,
	// 			clean_sheets: 0,
	// 		});
	// 	}
	// 	for (let i=0;i<achiv.length;i++){
	// 		console.log('achiv[',i,'] ', achiv[i]);
	// 		await this.prisma.achievement.create({
	// 			data: {
	// 				user_id: user.user_id,
	// 				name: achiv[i].name,
	// 				description: achiv[i].description,
	// 				level: achiv[i].level,
	// 				goal_scoared: achiv[i].goal_scoared,
	// 				clean_sheets: achiv[i].clean_sheets,
	// 			}
	// 		});
	// 	}
	// }

}