import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class BasickTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const rawToken = req.headers['authorization'];

    try {
      if (!rawToken) {
        throw new UnauthorizedException('토큰이 없습니다.');
      }

      const token = await this.authService.checkedTokenFromHeader(
        rawToken,
        false,
      );

      const { email, password } = this.authService.decodeBasicToken(token);

      const user = await this.authService.checkedEmailAndPassword({
        email,
        password,
      });

      req.user = user;

      return true;
    } catch (error) {
      console.log(error);
    }
  }
}
