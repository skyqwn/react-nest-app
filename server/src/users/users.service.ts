import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dtos/creat-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  async createUser({ email, nickname, password }: CreateUserInput) {
    try {
      const emailExists = await this.usersRepository.exists({
        where: {
          email,
        },
      });

      if (emailExists) {
        return {
          ok: false,
          error: '이미 존재하는 이메일입니다.',
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

      const newUser = await this.usersRepository.save(
        this.usersRepository.create({ email, nickname, password }),
      );

      return {
        ok: true,
        user: newUser,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '계정 생성을 실패하였습니다.',
      };
    }
  }

  async getAllUsers() {
    return this.usersRepository.find({});
  }

  async getUserById(id: number) {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }
  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }
}
