import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { PaginateChatDto } from './dto/paginate-chat.dto';
import { AuthUser } from 'src/users/decorator/auth-user.decorator';
import { UsersModel } from 'src/users/entities/users.entity';

@Controller('message')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  paginateChat(@Query() dto: PaginateChatDto) {
    return this.chatsService.paginateChats(dto);
  }

  @Get('inbox')
  async inboxChats(@AuthUser() user: UsersModel) {
    console.log(1);
    return await this.chatsService.inBoxChats(user.id);
  }

  @Get(':cid')
  async detailChats(@Param('cid', ParseIntPipe) id: number) {
    return await this.chatsService.detailChats(id);
  }
}
