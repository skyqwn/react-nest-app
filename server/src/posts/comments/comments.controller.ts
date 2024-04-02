import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { PaginateCommentsDto } from './dtos/paginate-comments.dto';
import { CreateCommentsDto } from './dtos/create-comments-dto';
import { AuthUser } from 'src/users/decorator/auth-user.decorator';
import { UsersModel } from 'src/users/entities/users.entity';
import { QueryRunnerDecorator } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner } from 'typeorm';
import { UpdateCommentsDto } from './dtos/update-comments.dto';
import { IsCommentMineOrAdminGuard } from './guard/is-comment-mind-or-admin.guard';
import { PostsService } from '../posts.service';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.intercepter';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly postService: PostsService,
  ) {}

  @Get()
  @IsPublic()
  getComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() query: PaginateCommentsDto,
  ) {
    return this.commentsService.fetchComments(postId);
    // return this.commentsService.paginateComments(query, postId);
  }

  @Get(':commentId')
  @IsPublic()
  getComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.commentsService.getCommentById(commentId);
  }

  @Get('already/:commentId')
  async getAlreadyComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @AuthUser() author: UsersModel,
  ) {
    return this.commentsService.alreadyLike(author.id, commentId);
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async postComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: CreateCommentsDto,
    @QueryRunnerDecorator() qr: QueryRunner,
    @AuthUser() user: UsersModel,
  ) {
    const result = await this.commentsService.createComment(
      body,
      postId,
      user,
      qr,
    );

    await this.postService.incrementCommentCount(postId, qr);

    return result;
  }

  @Patch(':commentId')
  // @UseGuards(IsCommentMineOrAdminGuard)
  patchComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() body: UpdateCommentsDto,
  ) {
    return this.commentsService.patchComment(body, commentId);
  }

  @Delete(':commentId')
  // @UseGuards(IsCommentMineOrAdminGuard)
  @IsPublic()
  @UseInterceptors(TransactionInterceptor)
  async deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @QueryRunnerDecorator() qr: QueryRunner,
  ) {
    const result = await this.commentsService.deleteComment(commentId, qr);
    await this.postService.decrementCommentCount(postId);

    return result;
  }
}
