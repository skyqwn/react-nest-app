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
import { CommentsService } from '../comments/comments.service';

@Controller('likes')
export class LikesController {
  constructor(
    private readonly likesService: LikesService,
    private readonly commentService: CommentsService,
  ) {}

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
    return await this.likesService.postUnLikes(id, user, qr);
  }

  @Post('comments/:id')
  @UseInterceptors(TransactionInterceptor)
  async commentLike(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: UsersModel,
    @QueryRunnerDecorator() qr: QueryRunner,
  ) {
    await this.likesService.commentLikes(id, user, qr);
    await this.commentService.incrementLikeCount(id);
    return true;
  }

  @Delete('comments/:id')
  @UseInterceptors(TransactionInterceptor)
  async commentUnlike(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: UsersModel,
    @QueryRunnerDecorator() qr: QueryRunner,
  ) {
    await this.likesService.commentUnlikes(id, user, qr);
    await this.commentService.decrementLikeCount(id);
  }
}
