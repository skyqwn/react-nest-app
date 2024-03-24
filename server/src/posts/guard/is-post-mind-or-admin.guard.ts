import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RolesEnum } from 'src/users/constant/roles.constant';
import { PostsService } from '../posts.service';
import { Request } from 'express';
import { UsersModel } from 'src/users/entities/users.entity';

@Injectable()
export class IsPostMindOrAdminGuard implements CanActivate {
  constructor(private readonly postService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request & {
      user: UsersModel;
    };

    const { user } = req;

    if (!user) {
      throw new UnauthorizedException(`사용자가 존재하지 않습니다.`);
    }

    if (user.role === RolesEnum.ADMIN) {
      return true;
    }

    const postId = req.params.postId;

    if (!postId) {
      throw new BadRequestException(`포스트id가 존재하지 않습니다.`);
    }

    const isOk = await this.postService.isPostMine(user.id, +postId);

    if (!isOk) {
      throw new ForbiddenException(`권한이 없습니다`);
    }
    return true;
  }
}
