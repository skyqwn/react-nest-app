import { PickType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { UsersModel } from 'src/users/entities/users.entity';

export class RegisterUserInput extends PickType(UsersModel, [
  'nickname',
  'email',
  'password',
]) {
  @IsString()
  verifyPassword: string;
}
