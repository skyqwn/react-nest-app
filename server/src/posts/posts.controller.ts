import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostInput } from './dtos/create-posts.dto';
import { AuthUser } from 'src/users/decorator/auth-user.decorator';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { UpdatePostInput } from './dtos/update-posts.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @IsPublic()
  getPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  @IsPublic()
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostId(id);
  }

  @Post()
  postPosts(
    @AuthUser('id') userId: number,
    @Body() createPostInput: CreatePostInput,
  ) {
    return this.postsService.createPost(createPostInput, userId);
  }

  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostInput: UpdatePostInput,
  ) {
    return this.postsService.updatePost(updatePostInput, id);
  }
}
