import { PickType } from '@nestjs/mapped-types';
import { UsersModel } from 'src/users/entities/users.entity';

export class PayloadInput extends PickType(UsersModel, ['id', 'nickname']) {}
