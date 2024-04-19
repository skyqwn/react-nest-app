import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ChatMessagesService } from './messages.service';
import { BasePaginationDto } from 'src/common/dtos/base-pagination.dto';

@Controller('chats/:cid/messages')
export class MessagesController {
  constructor(private readonly messagesService: ChatMessagesService) {}

  // @Get()
  // async PaginateMessage(
  //   @Param('cid', ParseIntPipe) id: number,
  //   @Query() dto: BasePaginationDto,
  // ) {
  //   return this.messagesService.paginateMessages(dto, {
  //     where: {
  //       chat: {
  //         id,
  //       },
  //     },
  //     relations: {
  //       author: true,
  //       chat: true,
  //     },
  //   });
  // }
  @Get()
  async fetchMessage(@Param('cid', ParseIntPipe) id: number) {
    return await this.messagesService.fetchMessage(id);
  }
}
