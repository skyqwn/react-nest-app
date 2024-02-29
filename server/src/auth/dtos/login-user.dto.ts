import { PickType } from '@nestjs/mapped-types';
import { UsersModel } from 'src/users/entities/users.entity';

export class LoginUserInput extends PickType(UsersModel, [
  'email',
  'password',
]) {}
