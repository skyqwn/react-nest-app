import { PickType } from '@nestjs/mapped-types';
import { PostsModel } from '../entities/posts.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { IsOptional, IsString } from 'class-validator';

export class CreatePostInput extends PickType(PostsModel, [
  'title',
  'content',
]) {}

// export class CreatePostOutput extends CoreOutput {
//   post?: PostsModel;
// }
