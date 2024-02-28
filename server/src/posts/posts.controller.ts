import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostInput, CreatePostOutput } from './dtos/create-posts.dto';

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
  postPosts(
    @Body() createPostInput: CreatePostInput,
  ): Promise<CreatePostOutput> {
    return this.postsService.createPost(createPostInput);
  }
}
