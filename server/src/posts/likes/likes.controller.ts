import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthUser } from 'src/users/decorator/auth-user.decorator';
import { UsersModel } from 'src/users/entities/users.entity';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.intercepter';
import { QueryRunnerDecorator } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner } from 'typeorm';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get('posts/:id')
  @UseInterceptors(TransactionInterceptor)
  async alreadyLike(
    @AuthUser() user: UsersModel,
    @Param('id', ParseIntPipe) postId: number,
    @QueryRunnerDecorator() qr: QueryRunner,
  ) {
    return await this.likesService.alreadyLike(postId, user.id);
  }

  @Post('posts/:id')
  @UseInterceptors(TransactionInterceptor)
  async postLike(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: UsersModel,
    @QueryRunnerDecorator() qr: QueryRunner,
  ) {
    return await this.likesService.postLikes(id, user, qr);
  }

  @Delete('posts/:id')
  @UseInterceptors(TransactionInterceptor)
  async deleteLike(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: UsersModel,
    @QueryRunnerDecorator() qr: QueryRunner,
  ) {
    return await this.likesService.postDisLikes(id, user, qr);
  }
}
