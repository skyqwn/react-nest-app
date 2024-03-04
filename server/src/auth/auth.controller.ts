import {
  Body,
  Controller,
  Headers,
  Post,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserInput } from './dtos/register-user.dto';
import { LoginUserInput } from './dtos/login-user.dto';
import { CookieOptions, Response } from 'express';
import { BasickTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/refresh')
  async postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = await this.authService.checkedTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, true);

    return {
      refreshToken: newToken,
    };
  }

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  async createTokenAccess(@Headers('authorization') rawToken: string) {
    const token = await this.authService.checkedTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, false);

    return {
      accessToken: newToken,
    };
  }

  @Post('login/email')
  @UseGuards(BasickTokenGuard)
  async loginEmail(@Headers('authorization') rawToken: string) {
    const token = await this.authService.checkedTokenFromHeader(
      rawToken,
      false,
    );
    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }

  @Post('register/email')
  registerEmail(@Body() registerUserInput: RegisterUserInput) {
    return this.authService.registerWithEmail(registerUserInput);
  }

  @Post('/logout')
  async logout() {
    return await this.logout();
  }
}
