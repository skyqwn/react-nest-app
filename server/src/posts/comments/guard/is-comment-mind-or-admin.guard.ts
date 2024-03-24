import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UsersModel } from 'src/users/entities/users.entity';
import { CommentsService } from '../comments.service';

@Injectable()
export class IsCommentMindOrAdminGuard implements CanActivate {
  constructor(private readonly commentsService: CommentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request & {
      user: UsersModel;
    };

    const user = req.user;

    if (!user) {
      throw new BadRequestException(`유저가 존재하지 않습니다.`);
    }

    const commentId = req.params.commentId;

    if (!commentId) {
      throw new BadRequestException(`코멘트 아이디가 존재하지않습니다.`);
    }

    const isOk = await this.commentsService.isCommentMind(user.id, +commentId);

    if (!isOk) {
      throw new ForbiddenException(`코멘트가 존재하지 않습니다.`);
    }

    return true;
  }
}
