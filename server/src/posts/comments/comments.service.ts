import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsModel } from './entities/comments.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginateCommentsDto } from './dtos/paginate-comments.dto';
import { CreateCommentDto } from './dtos/create-comment-dto';
import { UsersModel } from 'src/users/entities/users.entity';

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

  createComment(dto: CreateCommentDto, postId: number, author: UsersModel) {
    return this.commentsRepository.save({
      ...dto,
      post: {
        id: postId,
      },
      author,
    });
  }
}
