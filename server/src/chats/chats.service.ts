import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatsModel } from './entity/chats.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { CommonService } from 'src/common/common.service';
import { PaginateChatDto } from './dto/paginate-chat.dto';
import { exist } from 'joi';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatsModel)
    private readonly chatsRepository: Repository<ChatsModel>,
    private readonly commonService: CommonService,
  ) {}

  async paginateChats(dto: PaginateChatDto) {
    try {
      return await this.commonService.paginate(
        dto,
        this.chatsRepository,
        {
          relations: {
            users: true,
          },
        },
        'chats',
      );
    } catch (error) {
      console.log(error);
    }
  }

  async createChat(dto: CreateChatDto) {
    try {
      const chat = await this.chatsRepository.save({
        // 1,2,3
        // [{id:1}, {id:2}, {id:3}]
        users: dto.userIds.map((id) => ({ id })),
      });
      return this.chatsRepository.findOne({
        where: {
          id: chat.id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async checkIfChatExists(chatId: number) {
    try {
      const exists = await this.chatsRepository.exists({
        where: {
          id: chatId,
        },
      });
      return exists;
    } catch (error) {
      console.log(error);
    }
  }
}
