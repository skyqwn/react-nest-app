import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { Repository } from 'typeorm';
import { CreatePostInput } from './dtos/create-posts.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}

  async getAllPosts() {
    return this.postsRepository.find({
      relations: {
        author: true,
      },
    });
  }

  async getPostId(id: number) {
    try {
      const post = await this.postsRepository.findOne({
        where: {
          id,
        },
        relations: {
          author: true,
        },
      });
      if (!post) {
        return {
          ok: false,
          error: `id:${id}에 해당 포스트를 찾을 수 없습니다.`,
        };
      }

      return {
        ok: true,
        post,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async createPost({ content, title, authorId }: CreatePostInput) {
    try {
      const post = this.postsRepository.create({
        author: {
          id: authorId,
        },
        content,
        title,
      });

      const newPost = await this.postsRepository.save(post);
      return {
        ok: true,
        post: newPost,
      };
    } catch (error) {
      return {
        ok: false,
        error: '포스트를 생성하지 못했습니다',
      };
    }
  }
}
