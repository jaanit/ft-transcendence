import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { messageDto } from 'src/chat/dto/message.dto';
import { GroupsService } from 'src/chat/services/groups/groups.service';
import { MessagesService } from 'src/chat/services/messages/messeges.service';

@Controller('/v1/api/messages')
export class MessagesController {
  constructor(
    private GroupsService: GroupsService,
    private MessagesService: MessagesService,
  ) {}

  @Get('/getMessages')
  @UseGuards(AuthGuard('jwt'))
  async getMessages(
    @Res() res,
    @Req() req,
    @Query('groupId', ParseIntPipe) groupId: number,
  ) {
    const user = await this.GroupsService.checkAdmin(req.user.auth_id, groupId);
    if (user === 'notMember' || user === 'banned')
      return res.status(401).send();
    const messages = await this.MessagesService.getMessages(groupId, req.user.auth_id);
    return res.status(200).json(messages);
  }
  @Post('/sendMessages')
  @UseGuards(AuthGuard('jwt'))
  async sendMessage(@Res() res, @Req() req, @Body(new ValidationPipe()) messageDto: messageDto) {
    const user = await this.GroupsService.getMembership(
      req.user.auth_id,
      messageDto.groupId,
    );
    if (user.banned || new Date(user.muted) > new Date()) {
      return res.status(401).send();
    }
    const messages = await this.MessagesService.createMessage(
      req.user.auth_id,
      messageDto,
    );
    return res.status(200).send();
  }
}
