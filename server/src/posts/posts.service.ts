import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import {
  FindOptionsWhere,
  LessThan,
  MoreThan,
  Not,
  QueryRunner,
  Repository,
} from 'typeorm';
import { CreatePostInput } from './dtos/create-posts.dto';
import { UpdatePostInput } from './dtos/update-posts.dto';
import { PaginatePostsDto } from './dtos/paginate-post.dto';
import { ConfigService } from '@nestjs/config';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
  ) {}

  async getAllPosts() {
    return this.postsRepository.find({
      relations: {
        author: true,
      },
    });
  }

  // async generatePosts(userId: number) {
  //   for (let i = 0; i < 100; i++) {
  //     await this.createPost(userId, {
  //       title: `임의로 생성된 포스트 제목 ${i}`,
  //       content: `임의로 생성된 포스트${i}`,
  //     });
  //   }
  // }

  async paginatePosts(dto: PaginatePostsDto) {
    return this.commonService.paginate(
      dto,
      this.postsRepository,
      { relations: ['author'] },
      'posts',
    );
    // if (dto.page) {
    //   return this.pagePaginatePosts(dto);
    // } else {
    //   return this.cursorPaginatePosts(dto);
    // }
  }

  async pagePaginatePosts(dto: PaginatePostsDto) {
    const [posts, count] = await this.postsRepository.findAndCount({
      skip: dto.take * (dto.page - 1),
      take: dto.take,
      order: {
        createdAt: dto.order__createdAt,
      },
    });
    return {
      data: posts,
      total: count,
    };
  }

  async cursorPaginatePosts(dto: PaginatePostsDto) {
    const where: FindOptionsWhere<PostsModel> = {};

    if (dto.where__id__less_than) {
      where.id = LessThan(dto.where__id__less_than);
    } else if (dto.where__id__more_than) {
      where.id = MoreThan(dto.where__id__more_than);
    }

    const posts = await this.postsRepository.find({
      where,
      order: {
        createdAt: dto.order__createdAt,
      },
      take: dto.take,
    });

    //
    const lastItem =
      posts.length > 0 && posts.length === dto.take
        ? posts[posts.length - 1]
        : null;

    const nextUrl =
      lastItem &&
      new URL(
        `${this.configService.get('PROTOCOL')}://${this.configService.get('HOST')}/posts`,
      );

    if (nextUrl) {
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (
            key !== 'where__id__more_than' &&
            key !== 'where__id__less_than'
          ) {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }

      let key = null;

      if (dto.order__createdAt === 'ASC') {
        key = 'where__id__more_than';
      } else {
        key = 'where__id__less_than';
      }

      nextUrl.searchParams.append(key, lastItem.id.toString());
    }

    return {
      data: posts,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: posts.length,
      next: nextUrl?.toString() ?? null,
    };
  }

  async getPostById(id: number) {
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

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<PostsModel>(PostsModel)
      : this.postsRepository;
  }

  async createPost(
    authorId: number,
    createPostInput: CreatePostInput,
    imageUrl: string[],
    qr?: QueryRunner,
  ) {
    const repository = this.getRepository(qr);

    try {
      const post = repository.create({
        author: {
          id: authorId,
        },
        ...createPostInput,
        images: imageUrl,
      });

      const newPost = await repository.save(post);
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

  async deletePost(postId: number) {
    const post = this.postsRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException();
    }

    await this.postsRepository.delete(postId);

    return postId;
  }

  async checkPostExistsById(id: number) {
    return this.postsRepository.exists({
      where: {
        id,
      },
    });
  }

  async isPostMine(userId: number, postId: number) {
    return this.postsRepository.exists({
      where: {
        id: postId,
        author: { id: userId },
      },
      relations: {
        author: true,
      },
    });
  }
}
