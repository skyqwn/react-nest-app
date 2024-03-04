import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostInput, CreatePostOutput } from './dtos/create-posts.dto';
import { AuthUser } from 'src/users/decorator/auth-user.decorator';
import { UsersModel } from 'src/users/entities/users.entity';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param('id') id: number) {
    return this.postsService.getPostId(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  postPosts(
    @AuthUser('id') userId: number,
    @Body() createPostInput: CreatePostInput,
  ): Promise<CreatePostOutput> {
    return this.postsService.createPost(createPostInput, userId);
  }
}
