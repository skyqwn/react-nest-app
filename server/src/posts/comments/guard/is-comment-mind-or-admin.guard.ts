import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { RolesEnum } from 'src/users/constant/roles.constant';
import { UsersModel } from 'src/users/entities/users.entity';
import { CommentsService } from '../comments.service';

@Injectable()
export class IsCommentMineOrAdminGuard implements CanActivate {
  constructor(private readonly commentsService: CommentsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request & {
      user: UsersModel;
    };

    const { user } = req;

    if (!user) {
      throw new UnauthorizedException('사용자의 정보를 가져올 수 없습니다.');
    }

    if (user.role === RolesEnum.ADMIN) {
      return true;
    }

    const commentId = req.params.commentId;

    if (!commentId) {
      throw new BadRequestException(
        'CommentId가 파라미터로 제공 되어야합니다.',
      );
    }

    const isOk = await this.commentsService.isCommentMind(+commentId, user.id);

    if (!isOk) {
      throw new ForbiddenException('코멘트가 존재하지 않습니다.');
    }

    return true;
  }
}
