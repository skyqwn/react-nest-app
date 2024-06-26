import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagesModel } from './entity/messages.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { BasePaginationDto } from 'src/common/dtos/base-pagination.dto';
import { CreateMessagesDto } from './dto/create-messages.dto';

@Injectable()
export class ChatMessagesService {
  constructor(
    @InjectRepository(MessagesModel)
    private readonly messagesRepository: Repository<MessagesModel>,
    private readonly commonService: CommonService,
  ) {}

  async createMessage(dto: CreateMessagesDto) {
    const message = await this.messagesRepository.save({
      chat: {
        id: dto.chatId,
      },
      author: {
        id: dto.senderId,
      },
      message: dto.message,
    });

    return await this.messagesRepository.findOne({
      where: {
        id: message.id,
      },
      relations: {
        author: true,
      },
      select: {
        author: {
          id: true,
          nickname: true,
          avatar: true,
        },
      },
    });
  }

  async fetchMessage(id: number) {
    return await this.messagesRepository.find({
      where: {
        chat: {
          id,
        },
      },
      relations: {
        author: true,
      },
    });
  }

  async paginateMessages(
    dto: BasePaginationDto,
    overrideFindOptions: FindManyOptions<MessagesModel>,
  ) {
    return this.commonService.paginate(
      dto,
      this.messagesRepository,
      overrideFindOptions,
      'messages',
    );
  }
}
