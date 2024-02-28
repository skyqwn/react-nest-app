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

  async createUser({
    email,
    nickname,
    password,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const newUser = await this.usersRepository.save(
        this.usersRepository.create({ email, nickname, password }),
      );

      return {
        ok: true,
        user: newUser,
      };
    } catch (error) {
      return {
        ok: false,
        error: '계정 생성을 실패하였습니다.',
      };
    }
  }

  async getAllUsers() {
    return this.usersRepository.find({});
  }
}
