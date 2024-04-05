import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikesModel } from './entities/likes.entity';
import { ChildEntity, DataSource, QueryRunner, Repository } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { PostsService } from '../posts.service';
import { CommentsService } from '../comments/comments.service';
import { PostsModel } from '../entities/posts.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikesModel)
    private readonly likesRepository: Repository<LikesModel>,
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly dataSource: DataSource,
  ) {}

  getRepositoy(qr: QueryRunner) {
    return qr
      ? qr.manager.getRepository<LikesModel>(LikesModel)
      : this.likesRepository;
  }

  async postLikes(postId: number, author: UsersModel, qr?: QueryRunner) {
    const likesRepository = this.getRepositoy(qr);

    const newLike = await likesRepository.save({
      author,
      post: {
        id: postId,
      },
    });

    // );
    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
    });

    await this.postsRepository.update(
      {
        id: postId,
      },
      {
        likeUsers: [...post.likeUsers, author.id + ''],
      },
    );
    await this.postsService.increamentLikeCount(postId);

    return true;
  }

  async postUnLikes(postId: number, author: UsersModel, qr?: QueryRunner) {
    try {
      const likesRepository = this.getRepositoy(qr);

      await likesRepository.delete({
        author,
        post: {
          id: postId,
        },
      });

      const post = await this.postsRepository.findOne({
        where: {
          id: postId,
        },
      });

      const newPostLikeUsers = post.likeUsers.filter(
        (v) => v !== author.id + '',
      );

      await this.postsRepository.update(
        {
          id: postId,
        },
        {
          likeUsers: newPostLikeUsers,
        },
      );

      await this.postsService.decrementLikeCount(postId);

      return true;
    } catch (error) {
      throw new BadRequestException('서버 에러 발생');
    }
  }

  async commentLikes(commentId: number, author: UsersModel, qr?: QueryRunner) {
    try {
      await this.likesRepository.save({
        author,
        comment: {
          id: commentId,
        },
      });

      await this.commentsService.includeLikeUsers(author.id, commentId);

      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async commentUnlikes(
    commentId: number,
    author: UsersModel,
    qr?: QueryRunner,
  ) {
    try {
      await this.likesRepository.delete({
        author,
        comment: {
          id: commentId,
        },
      });

      await this.commentsService.excludeLikeUsers(author.id, commentId);

      return true;
    } catch (error) {
      console.log(error);
    }
  }
}
