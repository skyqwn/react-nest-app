import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
import { UsersModel } from 'src/users/entities/users.entity';
import { SocketCatchHttpExceptionFilter } from 'src/common/interceptor/socker-catch-http.exceptionFilter';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';

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
  cors: {
    origin: [`${process.env.CLIENT_URL}`],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  // ws://localhost:4000/chats
  namespace: 'chats',
})
export class ChatsGateWay
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messageSerivce: ChatMessagesService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  private connectedClients = new Map();

  afterInit(server: any) {
    console.log(`after gateway init`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`on disconnect called: ${socket.id}`);
  }

  async handleConnection(socket: Socket & { user: UsersModel }) {
    console.log(`on Connect called : ${socket.id}`);

    const headers = socket.handshake.headers;

    const rawToken = headers['authorization'];

    if (!rawToken) {
      socket.disconnect();
      throw new WsException(`토큰이 존재하지 않습니다.`);
    }

    try {
      const token = await this.authService.checkedTokenFromHeader(
        rawToken,
        true,
      );

      const payload = this.authService.verifyToken(token);

      const user = await this.userService.getUserByEmail(payload.email);

      socket.user = user;

      return true;
    } catch (error) {
      socket.disconnect();
    }
  }

  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    const chatId = await this.chatsService.createChat(data);
    socket.emit('create_chat_recive', chatId);
  }

  @SubscribeMessage('enter_chat')
  async enterChat(
    @MessageBody() data: EnterChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const existChatRoom = await this.chatsService.checkIfChatExists(
      +data.chatId,
    );
    if (!existChatRoom) {
      throw new WsException(`잘못된 경로입니다.`);
    }

    socket.join(data.chatId);
  }

  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() dto: CreateMessagesDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    // const chatExist = await this.chatsService.checkIfChatExists(dto.chatId);
    //

    // if (!chatExist) {
    //   throw new WsException(
    //     `존재하지 않는 채팅방입니다. Chat ID: ${dto.chatId}`,
    //   );
    // }

    const message = await this.messageSerivce.createMessage(dto);

    // const otherSocketId = this.connectedClients.get(+dto.reciverId);

    socket.to(dto.chatId.toString()).emit('receive_message', message);

    return message;
  }
}
