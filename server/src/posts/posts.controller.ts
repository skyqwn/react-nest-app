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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostInput } from './dtos/create-posts.dto';
import { AuthUser } from 'src/users/decorator/auth-user.decorator';
import { UpdatePostInput } from './dtos/update-posts.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { PaginatePostsDto } from './dtos/paginate-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CommonService } from 'src/common/common.service';
import { DataSource, QueryRunner } from 'typeorm';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.intercepter';
import { QueryRunnerDecorator } from 'src/common/decorator/query-runner.decorator';
import { IsPostMindOrAdminGuard } from './guard/is-post-mind-or-admin.guard';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commonService: CommonService,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  @IsPublic()
  getPosts(@Query() query: PaginatePostsDto) {
    return this.postsService.paginatePosts(query);
  }

  @Get(':id')
  @IsPublic()
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(FilesInterceptor('images', 10))
  async postPosts(
    @AuthUser('id') userId: number,
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createPostInput: CreatePostInput,
    @QueryRunnerDecorator() qr: QueryRunner,
  ) {
    const imageUrl: string[] = [];
    await Promise.all(
      images.map(async (file) => {
        const url = await this.commonService.fileUpload(file);
        imageUrl.push(url);
      }),
    );

    return await this.postsService.createPost(
      userId,
      createPostInput,
      imageUrl,
      qr,
    );
  }

  @Patch(':postId')
  @UseGuards(IsPostMindOrAdminGuard)
  patchPost(
    @Param('postId', ParseIntPipe) id: number,
    @Body() updatePostInput: UpdatePostInput,
  ) {
    return this.postsService.updatePost(updatePostInput, id);
  }

  @Delete(':id')
  // @UseGuards(IsPostMindOrAdminGuard)
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
