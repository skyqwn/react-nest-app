import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import { UsersModel } from 'src/users/entities/users.entity';
import { RegisterUserInput } from './dtos/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleUser } from './auth.controller';
import { ProviderEnum } from 'src/users/constant/roles.constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  loginUser(userId: number) {
    return {
      accessToken: this.signToken(userId, false),
      refreshToken: this.signToken(userId, true),
    };
  }

  async checkedEmailAndPassword(user: Pick<UsersModel, 'email' | 'password'>) {
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

      return existUser;
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '로그인에 실패하였습니다.',
      };
    }
  }
  //

  async checkedTokenFromHeader(header: string, isBearer: boolean) {
    try {
      const splitToken = header.split(' ');

      const prefix = isBearer ? 'Bearer' : 'Basic';

      if (splitToken.length !== 2 || splitToken[0] !== prefix) {
        // throw new UnauthorizedException('잘못된 토큰입니다.');
        // 토큰이 없는 경우, 새로운 유저로 간주하고 처리
        return null;
      }

      const token = splitToken[1];

      return token;
    } catch (error) {
      throw new UnauthorizedException(
        `헤더에 있는 토큰값이 일치하지 않습니다.`,
      );
    }
  }
  //
  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf8');

    const split = decoded.split(':');

    if (split.length !== 2) {
      throw new UnauthorizedException('잘못된 유형의 토큰입니다.');
    }

    const email = split[0];
    const password = split[1];

    return {
      email,
      password,
    };
  }

  async logout() {
    try {
    } catch (error) {}
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

      return {
        ok: true,
        user: existUser,
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

  async loginWithGoogle(user: GoogleUser) {
    const { email, displayName: nickname, picture, provider } = user;
    //구글 유저가 이미 있는경우
    // 구글 유저가 아니어서 회원가입
    const existUser = await this.userService.getUserByEmail(email);

    if (!existUser) {
      const newUser = await this.userService.createUser({
        email,
        nickname,
        provider,
        avatar: picture,
      });

      const { user: googleUser } = newUser;

      const accessToken = this.signToken(googleUser.id, false);
      const refreshToken = this.signToken(googleUser.id, true);

      const token = {
        accessToken,
        refreshToken,
      };

      return {
        ok: true,
        token,
        user: existUser,
      };
    } else if (existUser) {
      const accessToken = this.signToken(existUser.id, false);
      const refreshToken = this.signToken(existUser.id, true);

      const token = {
        accessToken,
        refreshToken,
      };

      return {
        ok: true,
        token,
        user: existUser,
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
        parseInt(process.env.HASH_ROUNDS),
        // this.configService.get('HASH_ROUNDS'),
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

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('토큰이 만료되었거나 잘못된 토큰입니다.');
    }
  }

  signToken(userId: number, isRefreshToken: boolean) {
    const payload = {
      sub: userId,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: isRefreshToken ? 36000 : 3000,
    });
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(
        ' Refresh Token으로만 토큰 재발급이 가능합니다.',
      );
    }
    //{ sub: 11, type: 'refresh', iat: 1710564727, exp: 1710568327 }
    return this.signToken(decoded.sub, isRefreshToken);
  }

  me(user: UsersModel) {
    try {
      return user;
    } catch (error) {
      throw new UnauthorizedException(`user정보가 존재하지 않습니다.`);
    }
  }
}
