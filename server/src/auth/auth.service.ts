import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { PayloadInput } from './dtos/payload-token.dto';
import { ConfigService } from '@nestjs/config';
import { LoginUserInput } from './dtos/login-user.dto';

import * as bcrypt from 'bcrypt';
import { UsersModel } from 'src/users/entities/users.entity';
import { RegisterUserInput } from './dtos/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  signToken(userId: number, isRefreshToken: boolean) {
    const payload = {
      sub: userId,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  loginUser(userId: number) {
    return {
      accessToken: this.signToken(userId, false),
      refreshToken: this.signToken(userId, true),
    };
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    try {
      const existUser = await this.userService.getUserByEmail(user.email);

      if (!existUser) {
        return {
          ok: false,
          error: '유저가 존재하지 않습니다.',
        };
      }
      // 1) 입력된 비밀번호
      // 2) 기존 해시 (hash) -> 사용자 정보에 저장되있는 hash
      const checkedPassword = await bcrypt.compare(
        user.password,
        existUser.password,
      );

      if (!checkedPassword) {
        return {
          ok: false,
          error: '비밀번호가 틀렸습니다.',
        };
      }

      return {
        ok: true,
        existUser,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '로그인에 실패하였습니다.',
      };
    }
  }

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    try {
      if (!user.email || !user.password) {
        return {
          ok: false,
          error: '빈칸을 다 입력해주세요.',
        };
      }

      const existUser = await this.userService.getUserByEmail(user.email);

      if (!existUser) {
        return {
          ok: false,
          error: '유저가 존재하지 않습니다.',
        };
      }
      const checkedPassword = await bcrypt.compare(
        user.password,
        existUser.password,
      );

      if (!checkedPassword) {
        return {
          ok: false,
          error: '비밀번호가 틀렸습니다.',
        };
      }

      const accessToken = this.signToken(existUser.id, false);
      const refreshToken = this.signToken(existUser.id, true);

      const token = {
        accessToken,
        refreshToken,
      };

      // res.cookie('refreshToken', refreshToken, {
      //   httpOnly: true,
      //   maxAge: 1000 * 60 * 60 * 24 * 7,
      // });

      return {
        ok: true,
        token,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '로그인에 실패하였습니다.',
      };
    }
  }

  async registerWithEmail(
    { email, nickname, password, verifyPassword }: RegisterUserInput,
    // user: Pick<UsersModel, 'nickname' | 'email' | 'password'>,
  ) {
    try {
      if (!email || !nickname || !password || !verifyPassword) {
        return {
          ok: false,
          error: '빈칸을 모두 채워주세요',
        };
      }

      if (password !== verifyPassword) {
        return {
          ok: false,
          error: '비밀번호를 같게 입력해주세요',
        };
      }

      const emailExists = await this.usersRepository.exists({
        where: {
          email,
        },
      });
      if (emailExists) {
        return {
          ok: false,
          error: '이미 가입된 이메일입니다.',
        };
      }
      //
      const nicknameExists = await this.usersRepository.exists({
        where: {
          nickname,
        },
      });

      if (nicknameExists) {
        return {
          ok: false,
          error: '이미 존재하는 닉네임입니다.',
        };
      }

      const hashPw = await bcrypt.hash(
        password,
        this.configService.get('HASH_ROUNDS'),
      );

      const newUser = await this.usersRepository.save(
        this.usersRepository.create({
          email,
          nickname,
          password: hashPw,
        }),
      );

      // const newUser = await this.userService.createUser({
      //   ...user,
      //   password: hashPw,
      // });

      // console.log(newUser);

      // const {
      //   user: { nickname, id },
      // } = newUser;

      return {
        ok: true,
        newUser,
      };
      // return this.loginUser({ nickname, id });
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '계정생성을 실패하였습니다.',
      };
    }
  }
}
