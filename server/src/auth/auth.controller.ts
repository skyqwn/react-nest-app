import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterUserInput } from './dtos/register-user.dto';
import { Request, Response } from 'express';
import { BasickTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { GoogleOauthGuard } from './guard/google-oauth.guard';

export interface GoogleUser {
  provider: string;
  id: string;
  email: string;
  name: string;
  picture: string;
  displayName: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('token/refresh')
  @IsPublic()
  async postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = await this.authService.checkedTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, true);

    return {
      refreshToken: newToken,
    };
  }
  //
  @Post('token/access')
  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  async createTokenAccess(
    // @Headers('authorization') rawToken: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      // res.redirect('http://localhost:3000/login');
      throw new UnauthorizedException('리프레시 토큰이 만료되었습니다.');
    }

    // const token = await this.authService.checkedTokenFromHeader(rawToken, true);

    const newAccessToken = this.authService.rotateToken(refreshToken, false);
    const newRefreshToken = this.authService.rotateToken(refreshToken, true);

    res.cookie('refreshToken', newRefreshToken, {
      secure: process.env.NODE_ENV === 'prod',
      httpOnly: process.env.NODE_ENV === 'prod',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.cookie('accessToken', newRefreshToken, {
      secure: process.env.NODE_ENV === 'prod',
      httpOnly: process.env.NODE_ENV === 'prod',
      maxAge: 1000 * 60 * 20,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  @Post('login/email')
  @IsPublic()
  @UseGuards(BasickTokenGuard)
  async loginEmail(
    @Headers('authorization') rawToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.checkedTokenFromHeader(
      rawToken,
      false,
    );
    const credentials = this.authService.decodeBasicToken(token);

    const result = await this.authService.loginWithEmail(credentials);

    const {
      token: { accessToken, refreshToken },
    } = result;

    res.cookie('refreshToken', refreshToken, {
      secure: process.env.NODE_ENV === 'prod',
      httpOnly: process.env.NODE_ENV === 'prod',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.cookie('accessToken', accessToken, {
      secure: process.env.NODE_ENV === 'prod',
      httpOnly: process.env.NODE_ENV === 'prod',
      maxAge: 1000 * 60 * 20,
    });

    return result;
  }

  @Post('register/email')
  @IsPublic()
  registerEmail(@Body() registerUserInput: RegisterUserInput) {
    return this.authService.registerWithEmail(registerUserInput);
  }

  @Post('/logout')
  async logout() {
    return await this.logout();
  }

  @Get('google')
  @IsPublic()
  @UseGuards(GoogleOauthGuard)
  async loginGoogle(@Req() req: Request, @Res() res: Response) {}

  @Get('google/callback')
  @IsPublic()
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(
    @Req() req: Request & { user: GoogleUser },
    @Res() res: Response,
  ) {
    const googleUser = req.user;

    const {
      token: { accessToken, refreshToken },
    } = await this.authService.loginWithGoogle(googleUser);

    res.cookie('refreshToken', refreshToken, {
      secure: process.env.NODE_ENV === 'prod',
      httpOnly: process.env.NODE_ENV === 'prod',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.cookie('accessToken', accessToken, {
      secure: process.env.NODE_ENV === 'prod',
      httpOnly: process.env.NODE_ENV === 'prod',
      maxAge: 1000 * 60 * 20,
    });

    res.redirect('http://localhost:3000');
  }
}
