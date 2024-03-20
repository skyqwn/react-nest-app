import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
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

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commonService: CommonService,
  ) {}

  @Get()
  @IsPublic()
  getPosts(@Query() query: PaginatePostsDto) {
    return this.postsService.paginatePosts(query);
  }

  // @Post('random')
  // async postPostsRandom(@AuthUser() user: UsersModel) {
  //   await this.postsService.generatePosts(user.id);
  // }

  @Get(':id')
  @IsPublic()
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostId(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 4))
  async postPosts(
    @AuthUser('id') userId: number,
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createPostInput: CreatePostInput,
  ) {
    const imageUrl: string[] = [];
    await Promise.all(
      images.map(async (file) => {
        const url = await this.commonService.fileUpload(file);
        console.log(url);
        imageUrl.push(url);
      }),
    );
    console.log(imageUrl);
    this.postsService.createPost(userId, createPostInput, imageUrl);
  }

  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostInput: UpdatePostInput,
  ) {
    return this.postsService.updatePost(updatePostInput, id);
  }
}
