import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class BasePaginationDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  where__id__less_than?: number;

  @IsNumber()
  @IsOptional()
  where__id__more_than?: number;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt: 'ASC' | 'DESC' = 'DESC';

  @IsNumber()
  @IsOptional()
  take: number = 10;
}
