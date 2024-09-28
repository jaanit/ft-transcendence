import { Controller, Get, Post, Res, Req, UseGuards, Param, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MatchHistoryService } from '../services/matchHistory.service';
import { UserService } from '../../user/services/user.service';

@Controller('/v1/api/GameMatch')
export class GameMatchController {

    constructor(private MatchHistoryService: MatchHistoryService, private UserService: UserService){}

    @Get('/global')
    @UseGuards(AuthGuard('jwt'))
    async globalGame(@Res() res, @Req() req)
    {
        const match = await this.MatchHistoryService.getMatchHistoryGlobal()
        return res.status(200).json(match)
    }
    @Get('/get')
    @UseGuards(AuthGuard('jwt'))
    async userGame(@Res() res, @Req() req, @Query("nickname") nickname: string)
    {
        const user = await this.UserService.getUserbyNickname(nickname)
        if (!user)
            return res.status(404).send()
        const match = await this.MatchHistoryService.getMatchHistory(user.auth_id)
        return res.status(200).json(match)
    }
    @Get('/Stats')
    @UseGuards(AuthGuard('jwt'))
    async getStats(@Res() res, @Req() req, @Query("auth_id") auth_id: string)
    {
        const state = await this.MatchHistoryService.getStats(req.user.auth_id, auth_id)
        return res.status(200).json(state)
    }
}