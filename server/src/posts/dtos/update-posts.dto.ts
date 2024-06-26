import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreatePostInput } from './create-posts.dto';

export class UpdatePostInput extends PartialType(CreatePostInput) {
  @IsString()
  @IsOptional()
  content?: string;

  @IsOptional()
  images?: string | string[];
}
