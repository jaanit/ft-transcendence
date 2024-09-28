import {
  Controller,
  Get,
  Post,
  UseGuards,
  Res,
  Req,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BlockService } from '../../services/block.service';

@Controller('/v1/api/block')
export class BlockController {
  constructor(private BlockService: BlockService) {}
  @Post('/blockUser')
  @UseGuards(AuthGuard('jwt'))
  async blockUser(@Body() data, @Res() res, @Req() request) {
    const blockerUserId = request.user.auth_id;
    const { auth } = data;
    const result = await this.BlockService.blockUser(auth, blockerUserId);
    return res.status(200).json({ message: result });
  }

  @Post('/unblock')
  @UseGuards(AuthGuard('jwt'))
  async unblock(@Body() data, @Res() res, @Req() request) {
    const blockerUserId = request.user.auth_id;
    const { auth } = data;
    const result = await this.BlockService.unblockUser(auth, blockerUserId);
    return res.status(200).json({ message: result });
  }
}
