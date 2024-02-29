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

@Injectable()
export class AuthService {
  /**
   * 1) Register
   *  - email,nickname,password 받고 사용자 생성한다.
   *  생성이 완료되면 accessToken과 refreshToken을 반환한다. <--- 또 다시 로그인을 안할떄
   *  회원가입후 로그인화면으로 이동할거면 필요없다
   *
   *
   * 2) Login
   *    - email, password를 입력하면 사용자 검증을 진행한다.
   *    - 검증이 완료되면 accessToken과 refresh토큰을 반환한다.
   *
   *  3) loginUser
   *      -(1)과 (2)에서 필요한  accessToken과 refreshToken을 반환하는 로직
   *
   *  4) signToken
   *      -(3)에서 필요한 accessToken과 refreshToken을 sign하는 로직
   *
   *  5) authenticateWithEmailAndPassword
   *      -(2)에서 로그인을 진행할때 필요한 기본적인 검증 진행`
   *      1. 사용자가 존재하는지 확인 (email)
   *      2. 비밀번호가 맞는지 확인
   *      3. 모두 퇑과하면 찾은 사용자 정보 반환
   *      4. loginWithEmail에서 반환된 데이터를 기반으로 토큰생성
   */
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Payload에 들어갈 정보
   *
   * 1) nickname
   * 2) sub -> id
   * 3) type : 'access' | 'refresh'
   */

  signToken(
    user: Pick<UsersModel, 'nickname' | 'id'>,
    isRefreshToken: boolean,
  ) {
    const payload = {
      nickname: user.nickname,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  loginUser(user: Pick<UsersModel, 'nickname' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
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
  }

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const { existUser } = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(existUser);
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
