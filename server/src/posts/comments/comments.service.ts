import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsModel } from './entities/comments.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginateCommentsDto } from './dtos/paginate-comments.dto';
import { CreateCommentsDto } from './dtos/create-comments-dto';
import { UsersModel } from 'src/users/entities/users.entity';
import { UpdateCommentsDto } from './dtos/update-comments.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsModel)
    private readonly commentsRepository: Repository<CommentsModel>,
    private readonly commonService: CommonService,
  ) {}

  getRepositoy(qr: QueryRunner) {
    return qr
      ? qr.manager.getRepository<CommentsModel>(CommentsModel)
      : this.commentsRepository;
  }

  async fetchComments(postId: number) {
    return this.commentsRepository.find({
      where: {
        post: {
          id: postId,
        },
      },
      relations: {
        author: true,
      },
      select: {
        author: {
          avatar: true,
          nickname: true,
          id: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async paginateComments(dto: PaginateCommentsDto, postId: number) {
    return this.commonService.paginate(
      dto,
      this.commentsRepository,
      {
        where: {
          post: {
            id: postId,
          },
        },
        relations: {
          author: true,
        },
        select: {
          author: {
            avatar: true,
            nickname: true,
            id: true,
          },
        },
      },
      `posts/${postId}/comments`,
    );
  }

  async getCommentById(id: number) {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: {
        author: true,
      },
      select: {
        author: {
          avatar: true,
          nickname: true,
        },
      },
    });

    if (!comment) {
      throw new BadRequestException(
        `${id}에 해당하는 코멘트가 존재하지 않습니다.`,
      );
    }

    return comment;
  }

  async createComment(
    dto: CreateCommentsDto,
    postId: number,
    author: UsersModel,
    qr?: QueryRunner,
  ) {
    const commentsRepository = this.getRepositoy(qr);

    return commentsRepository.save({
      ...dto,
      post: {
        id: postId,
      },
      author,
    });
  }

  async patchComment(dto: UpdateCommentsDto, commentId: number) {
    const comment = this.commentsRepository.findOne({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new BadRequestException(
        `${commentId}에 해당하는 댓글이 존재하지 않습니다.`,
      );
    }

    const prevComment = await this.commentsRepository.preload({
      id: commentId,
      ...dto,
    });

    const newComment = await this.commentsRepository.save(prevComment);

    return newComment;
  }

  async deleteComment(commentId: number, qr?: QueryRunner) {
    const commentsRepository = this.getRepositoy(qr);

    const comment = commentsRepository.findOne({
      where: {
        id: commentId,
      },
    });
    if (!comment) {
      throw new BadRequestException(
        `${commentId}에 해당하는 댓글이 존재하지 않습니다.`,
      );
    }

    await commentsRepository.delete(commentId);

    return commentId;
  }

  async isCommentMind(userId: number, commentId: number) {
    return await this.commentsRepository.exists({
      where: {
        id: commentId,
        author: {
          id: userId,
        },
      },
      relations: {
        author: true,
      },
    });
  }

  async incrementLikeCount(commentId: number) {
    await this.commentsRepository.increment(
      {
        id: commentId,
      },
      'likeCount',
      1,
    );

    return true;
  }
  async decrementLikeCount(commentId: number) {
    await this.commentsRepository.decrement(
      {
        id: commentId,
      },
      'likeCount',
      1,
    );

    return true;
  }

  async alreadyLike(userId: number, commentId: number) {
    const comment = await this.commentsRepository.find({
      where: {
        id: commentId,
        commentLikeUsers: userId,
      },
    });
    return comment;
  }

  async includeLikeUsers(userId: number, commentId: number) {
    const comment = await this.commentsRepository.findOne({
      where: {
        id: commentId,
      },
    });
    const newComment = {
      ...comment,
      commentLikeUsers: [...comment.commentLikeUsers, userId],
    };

    const result = await this.commentsRepository.save(newComment);
    return result;
  }
}
