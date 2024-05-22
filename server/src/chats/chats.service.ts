import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatsModel } from './entity/chats.entity';
import { ArrayContains, In, Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { CommonService } from 'src/common/common.service';
import { PaginateChatDto } from './dto/paginate-chat.dto';
import { WsException } from '@nestjs/websockets';

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

  async inBoxChats(userId: number) {
    try {
      const result = await this.chatsRepository.find({
        where: {
          users: {
            id: userId,
          },
        },
        relations: {
          users: true,
          messages: true,
        },
      });
      return result;
    } catch (error) {
      throw new BadRequestException('서버 오류발생');
    }
  }
  //
  async detailChats(id: number) {
    try {
      const chat = await this.chatsRepository.findOne({
        where: {
          id,
        },
        relations: ['users', 'messages', 'messages.author'],
      });

      if (!chat) {
        throw new BadRequestException(`잘못된 주소입니다.`);
      }
      console.log(chat);
      return chat;
    } catch (error) {
      console.log(error);
    }
  }
  //
  async createChat(dto: CreateChatDto) {
    try {
      const exist = await this.chatsRepository.findOne({
        where: {
          connectUser: ArrayContains(dto.userIds),
        },
        relations: {
          users: true,
        },
      });

      if (exist) {
        return exist.id;
      } else {
        const chat = await this.chatsRepository.save({
          // 1,2,3
          // [{id:1}, {id:2}, {id:3}]
          users: dto.userIds.map((id) => ({ id })),
          connectUser: [...dto.userIds],
        });
        return chat.id;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async checkInChatUser(userId: number) {
    if (!userId) {
      throw new BadRequestException(`서버 오류 발생`);
    }
    const exist = await this.chatsRepository.exists({
      where: {
        connectUser: ArrayContains([userId]),
      },
      relations: {
        users: true,
      },
    });
    if (!exist) {
      throw new WsException(`권한이 없습니다.`);
    }
    return exist;
  }

  async checkIfChatExists(chatId: number) {
    try {
      const exists = await this.chatsRepository.exists({
        where: {
          id: chatId,
        },
      });
      if (!exists) {
        throw new WsException(`채팅방이 존재하지않습니다.`);
      }
      return exists;
    } catch (error) {
      console.log(error);
    }
  }
}
