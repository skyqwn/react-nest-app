import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorator/is-public.decorator';

@Injectable()
export class BearerToeknGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    try {
      const req = context.switchToHttp().getRequest();

      if (isPublic) {
        req.isRoutePublic = true;
        return true;
      }
      const rawToken = req.headers['authorization'];

      if (!rawToken) {
        throw new UnauthorizedException('토큰이 없습니다.');
      }

      const token = await this.authService.checkedTokenFromHeader(
        rawToken,
        true,
      );

      const result = await this.authService.verifyToken(token);

      const user = await this.usersService.getUserById(result.sub);

      req.user = user;
      req.token = token;
      req.tokenType = result.type;

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

@Injectable()
export class AccessTokenGuard extends BearerToeknGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    const rawToken = req.headers['authorization'];

    if (req.isRoutePublic) {
      return true;
    }

    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    if (req.tokenType !== 'access') {
      throw new UnauthorizedException('Access Token이 아닙니다.');
    }

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerToeknGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();
    if (req.isRoutePublic) {
      return true;
    }

    const rawToken = req.headers['authorization'];

    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    if (req.tokenType !== 'refresh') {
      throw new UnauthorizedException('Refresh Token이 아닙니다.');
    }

    return true;
  }
}
