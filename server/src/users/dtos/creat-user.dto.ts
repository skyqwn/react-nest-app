import { PartialType, PickType } from '@nestjs/mapped-types';
import { UsersModel } from '../entities/users.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { IsString } from 'class-validator';

export class CreateUserInput extends PartialType(UsersModel) {}

export class CreateUserOutput extends CoreOutput {
  user?: UsersModel;
}
