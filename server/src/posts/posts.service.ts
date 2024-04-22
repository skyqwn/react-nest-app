import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import {
  ArrayContains,
  FindOptions,
  FindOptionsWhere,
  ILike,
  LessThan,
  Like,
  MoreThan,
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

  async paginatePosts(dto: PaginatePostsDto) {
    return this.commonService.paginate(
      dto,
      this.postsRepository,
      { relations: ['author'] },
      'posts',
    );
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
    const where: any[] = [];

    if (dto.where__id__less_than) {
      where.push({ id: LessThan(dto.where__id__less_than) });
    } else if (dto.where__id__more_than) {
      where.push({ id: MoreThan(dto.where__id__less_than) });
    }
    if (dto.term) {
      where.push({ author: { nickname: ILike(`%${dto.term}%`) } });
      where.push({ content: ILike(`%${dto.term}%`) });
    }

    const posts = await this.postsRepository.find({
      where,
      order: {
        createdAt: dto.order__createdAt,
      },
      relations: {
        author: true,
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

  async getPostByUserId(id: number) {
    try {
      const post = await this.postsRepository.find({
        where: {
          author: {
            id,
          },
        },
      });
      return post;
    } catch (error) {
      throw new BadRequestException(`서버에러 발생`);
    }
  }

  async getPostLikeByUserId(id: number) {
    try {
      const post = await this.postsRepository.find({
        where: { likeUsers: ArrayContains([id]) },
        select: { id: true, content: true, createdAt: true },
      });
      return post;
    } catch (error) {
      console.log(error);
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

  async incrementCommentCount(postId: number, qr?: QueryRunner) {
    const postRepository = this.getRepository(qr);

    await postRepository.increment(
      {
        id: postId,
      },
      'commentCount',
      1,
    );
    return true;
  }

  async decrementCommentCount(postId: number, qr?: QueryRunner) {
    const postRepository = this.getRepository(qr);

    await postRepository.decrement(
      {
        id: postId,
      },
      'commentCount',
      1,
    );

    return true;
  }

  async increamentLikeCount(postId: number, qr?: QueryRunner) {
    const postRepository = this.getRepository(qr);

    await postRepository.increment(
      {
        id: postId,
      },
      'likeCount',
      1,
    );
    return true;
  }

  async decrementLikeCount(postId: number, qr?: QueryRunner) {
    const postRepository = this.getRepository(qr);

    await postRepository.decrement(
      {
        id: postId,
      },
      'likeCount',
      1,
    );
    return true;
  }
}
