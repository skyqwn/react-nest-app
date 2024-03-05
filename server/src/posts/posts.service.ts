import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { Not, Repository } from 'typeorm';
import { CreatePostInput } from './dtos/create-posts.dto';
import { UpdatePostInput } from './dtos/update-posts.dto';

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
        throw new NotFoundException('해당 포스트는 없습니다.');
      }

      return post;
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async createPost(createPostInput: CreatePostInput, authorId: number) {
    try {
      const post = this.postsRepository.create({
        author: {
          id: authorId,
        },
        ...createPostInput,
      });

      const newPost = await this.postsRepository.save(post);
      return newPost;
    } catch (error) {
      return {
        ok: false,
        error: '포스트를 생성하지 못했습니다',
      };
    }
  }

  async updatePost({ content, title }: UpdatePostInput, postId: number) {
    // save의 기능
    // 1) 만약에 데이터가 존재하지 않는다면 (id 기준으로) 새로 생성한다.
    // 2) 만약에 데이터가 존재한다면 (같은 id의 값이 존재한다면) 존재하던 값을 업데이트한다.

    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('포스트가 존재하지 않습니다.');
    }

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }
}
