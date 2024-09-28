import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from '../service/notification.service';

@Controller('/v1/api/notification')
export class NotificationController{
    constructor(private NotificationService: NotificationService){}

    @Get('/get')
    @UseGuards(AuthGuard('jwt'))
    async getNotification(@Req() req, @Res() res)
    {
        const notification = await this.NotificationService.getNotifications(req.user.auth_id)
        return res.status(200).json(notification)
    }
    @Post('/seenAll')
    @UseGuards(AuthGuard('jwt'))
    async seenAllNotification(@Req() req, @Res() res)
    {
        await this.NotificationService.seenAllNotification(req.user.auth_id)
        return res.status(200).send()
    }
}