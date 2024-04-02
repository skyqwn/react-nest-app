import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikesModel } from './entities/likes.entity';
import { QueryRunner, Repository } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { PostsService } from '../posts.service';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikesModel)
    private readonly likesRepository: Repository<LikesModel>,
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) {}

  getRepositoy(qr: QueryRunner) {
    return qr
      ? qr.manager.getRepository<LikesModel>(LikesModel)
      : this.likesRepository;
  }

  async alreadyPostLike(postId: number, userId: number) {
    const alreadyLike = await this.likesRepository.exists({
      where: {
        author: {
          id: userId,
        },
        post: {
          id: postId,
        },
      },
    });

    return alreadyLike;
  }

  async alreadyCommentLike(userId: number, commentId: number) {
    const alreadyCommentLike = await this.likesRepository.find({
      where: {
        author: {
          id: userId,
        },
        comment: {
          id: commentId,
        },
      },
      relations: {
        author: true,
        comment: true,
      },
      select: {
        comment: {
          commentLikeUsers: true,
        },
      },
    });

    console.log(alreadyCommentLike);

    return alreadyCommentLike;
  }

  async postLikes(postId: number, author: UsersModel, qr?: QueryRunner) {
    const likesRepository = this.getRepositoy(qr);

    const newLike = await likesRepository.save({
      author,
      post: {
        id: postId,
      },
    });

    await this.postsService.increamentLikeCount(postId);

    return true;
  }

  async postDisLikes(postId: number, author: UsersModel, qr?: QueryRunner) {
    const likesRepository = this.getRepositoy(qr);

    await likesRepository.delete({
      author,
      post: {
        id: postId,
      },
    });

    await this.postsService.decrementLikeCount(postId);

    return true;
  }

  async commentLikes(commentId: number, author: UsersModel, qr?: QueryRunner) {
    await this.likesRepository.save({
      author,
      comment: {
        id: commentId,
      },
    });

    await this.commentsService.includeLikeUsers(author.id, commentId);

    return true;
  }
}
