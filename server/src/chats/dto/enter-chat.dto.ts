import { IsNumber, IsString } from 'class-validator';

export class EnterChatDto {
  @IsString()
  chatId: string;
}
