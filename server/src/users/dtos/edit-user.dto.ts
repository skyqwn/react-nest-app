import { PartialType, PickType } from '@nestjs/mapped-types';
import { UsersModel } from '../entities/users.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class EditUserInput extends PartialType(UsersModel) {}

export class CreateUserOutput extends CoreOutput {
  user?: UsersModel;
}
