import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BasePaginationDto } from 'src/common/dtos/base-pagination.dto';

export class PaginatePostsDto extends BasePaginationDto {
  @IsNumber()
  @IsOptional()
  where__likeCount__more_than?: number;

  @IsString()
  @IsOptional()
  where__title__i_like: string;

  @IsString()
  @IsOptional()
  term: string;
}
