import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatsService } from './chats.service';
import { EnterChatDto } from './dto/enter-chat.dto';
import { CreateMessagesDto } from './messages/dto/create-messages.dto';
import { ChatMessagesService } from './messages/messages.service';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { SocketCatchHttpExceptionFilter } from 'src/common/interceptor/socker-catch-http.exceptionFilter';

@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true, // class-validator옵션을 보고 자동으로 변환하고 데코레이터 통과
    },
    whitelist: true, // 데코레이터에 적용이 안된 값들은 입력되지않고 삭제해버린다
    forbidNonWhitelisted: true, // whitelist에대한 에러값들을 반환해준다.
  }),
)
@UseFilters(SocketCatchHttpExceptionFilter)
@WebSocketGateway({
  // ws://localhost:4000/chats
  namespace: 'chats',
})
export class ChatsGateWay implements OnGatewayConnection {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messageSerivce: ChatMessagesService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log(`on Connect called : ${socket.id}`);
  }
  //
  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const chat = await this.chatsService.createChat(data);
  }

  @SubscribeMessage('enter_chat')
  async enterChat(
    // 방의 chat ID들을 리스트로 받는다.
    @MessageBody() data: EnterChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    for (const chatId of data.chatIds) {
      const exist = await this.chatsService.checkIfChatExists(chatId);

      if (!exist) {
        throw new WsException({
          code: 100,
          message: `존재하지 않는 chat 입니다. chatId: ${chatId}`,
        });
      }
    }

    socket.join(data.chatIds.map((x) => x.toString()));
  }

  // socker.on('send_message', (message) => {console.log(message)});
  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() dto: CreateMessagesDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const chatExist = await this.chatsService.checkIfChatExists(dto.chatId);

    if (!chatExist) {
      throw new WsException(
        `존재하지 않는 채팅방입니다. Chat ID: ${dto.chatId}`,
      );
    }

    const message = await this.messageSerivce.createMessage(dto);

    socket
      .to(message.chat.id.toString())
      .emit('receive_message', message.message);
    // this.server
    //   .in(message.chatId.toString())
    //   .emit('receive_message', message.message);
  }
}
