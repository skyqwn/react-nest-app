import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserInput } from './dtos/register-user.dto';
import { LoginUserInput } from './dtos/login-user.dto';
import { CookieOptions, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  async loginEmail(
    @Body() loginUserInput: LoginUserInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { token } = await this.authService.loginWithEmail(loginUserInput);
      if (!token) {
        return {
          ok: false,
          error: '아이디 또는 비밀번호를 확인하세요',
        };
      }
      res.cookie('refreshToken', token.refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });

      return {
        ok: true,
        token,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '아이디 또는 비밀번호를 확인해주세요',
      };
    }
  }

  @Post('register/email')
  registerEmail(@Body() registerUserInput: RegisterUserInput) {
    return this.authService.registerWithEmail(registerUserInput);
  }
}
