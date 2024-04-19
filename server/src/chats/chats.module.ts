import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatsGateWay } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsModel } from './entity/chats.entity';
import { CommonModule } from 'src/common/common.module';
import { ChatMessagesService } from './messages/messages.service';
import { MessagesModel } from './messages/entity/messages.entity';
import { MessagesController } from './messages/messages.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { UsersModel } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatsModel, MessagesModel, UsersModel]),
    CommonModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [ChatsController, MessagesController],
  providers: [ChatsGateWay, ChatsService, ChatMessagesService],
})
export class ChatsModule {}
