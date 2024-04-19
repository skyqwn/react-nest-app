import { PickType } from '@nestjs/mapped-types';
import { MessagesModel } from '../entity/messages.entity';
import { IsNumber, IsString } from 'class-validator';

export class CreateMessagesDto extends PickType(MessagesModel, ['message']) {
  @IsString()
  chatId: string;

  @IsString()
  senderId: string;

  @IsString()
  reciverId: string;
}
