import { PickType } from '@nestjs/mapped-types';
import { UsersModel } from '../entities/users.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { IsString } from 'class-validator';

export class CreateUserInput extends PickType(UsersModel, [
  'email',
  'nickname',
  'password',
]) {}

export class CreateUserOutput extends CoreOutput {
  user?: UsersModel;
}
