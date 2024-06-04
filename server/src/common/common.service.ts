import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePaginationDto } from './dtos/base-pagination.dto';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BaseModel } from './entities/base.entity';
import { FILTER_MAPPER } from './constant/filter-mapper.const';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { returnCurrentDate } from 'src/posts/util/currentDate';
import sharp from 'sharp';

@Injectable()
export class CommonService {
  private readonly s3Config: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Config = new S3Client({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY,
      },
    });
  }

  async fileUpload(image: Express.Multer.File) {
    const objectName = `${returnCurrentDate() + image.originalname}`;

    console.log(image.size);
    //이미지 사이즈 수정
    const transfromImage = await this.sharpImage(image, 800);

    console.log(transfromImage);

    const input = {
      Body: transfromImage,
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: objectName,
    };
    await this.s3Config.send(new PutObjectCommand(input));
    const s3Domain = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com`;

    return `${s3Domain}/${input.Key}`;
  }

  private async sharpImage(image: Express.Multer.File, size: number) {
    const sharpImage = await sharp(image.buffer)
      .resize(size)
      .toFormat('webp')
      .toBuffer();
    return sharpImage;
  }

  paginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    if (dto.page) {
      return this.pagePaginate(dto, repository, overrideFindOptions);
    } else {
      return this.cursorPaginate(dto, repository, overrideFindOptions, path);
    }
  }

  private async pagePaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ) {
    const findOptions = this.composeFindOptions<T>(dto);

    const [data, count] = await repository.findAndCount({
      ...findOptions,
      ...overrideFindOptions,
    });

    return {
      data,
      total: count,
    };
  }

  private async cursorPaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    const findOptions = this.composeFindOptions<T>(dto);

    const results = await repository.find({
      ...findOptions,
      ...overrideFindOptions,
    });

    const lastItem =
      results.length > 0 && results.length === dto.take
        ? results[results.length - 1]
        : null;

    const nextUrl =
      lastItem &&
      new URL(
        `${this.configService.get('PROTOCOL')}://${this.configService.get('HOST')}/${path}`,
      );

    if (nextUrl) {
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (
            key !== 'where__id__more_than' &&
            key !== 'where__id__less_than'
          ) {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }

      let key = null;

      if (dto.order__createdAt === 'ASC') {
        key = 'where__id__more_than';
      } else {
        key = 'where__id__less_than';
      }

      nextUrl.searchParams.append(key, lastItem.id.toString());
    }

    return {
      data: results,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: results.length,
      next: nextUrl?.toString() ?? null,
    };
  }

  private composeFindOptions<T extends BaseModel>(
    dto: BasePaginationDto,
  ): FindManyOptions<T> {
    let where: FindOptionsWhere<T> = {};
    let order: FindOptionsOrder<T> = {};

    for (const [key, value] of Object.entries(dto)) {
      if (key.startsWith('where__')) {
        where = {
          ...where,
          ...this.parseWhereFilter(key, value),
        };
      } else if (key.startsWith('order__')) {
        order = {
          ...order,
          ...this.parseOrderFilter(key, value),
        };
      }
    }

    return {
      where,
      order,
      take: dto.take,
      skip: dto.page ? dto.take * (dto.page - 1) : null,
    };
  }

  private parseWhereFilter<T extends BaseModel>(
    key: string,
    value: any,
  ): FindOptionsWhere<T> | FindOptionsOrder<T> {
    const options: FindOptionsWhere<T> = {};

    const split = key.split('__');

    if (split.length !== 2 && split.length !== 3) {
      throw new BadRequestException(
        `where 필터는 '__' split 했을때 2 또는 3이어야 합니다. 문제되는 키값 ${key}`,
      );
    }

    if (split.length === 2) {
      // ['where','id']
      const [_, field] = split;
      /**
       *  field -> 'id'
       *  value -> 3
       *
       *  {
       *      id:3
       *  }
       */
      options[field] = value;
    } else {
      /**
       * 길이가 3일 경우에는 Typeorm 유틸리티 적용이 필요한 경우이다.
       *
       * where__id__more_than의 경우
       * where는 버려도 되고 두번째 값은 필터할 키값이 되고
       *  세번째 값은 typeorm 유틸리티가 된다
       *
       *  FILTER_MAPPER에 미리 정의해둔 값들로
       *  field 값에 FILTER_MAPPER에서 해당되는 utility를 가져온 후
       *  값에 적용해준다
       */

      //['where','id',''more_than'']
      const [_, field, operator] = split;

      if (operator === 'i_like') {
        options[field] = FILTER_MAPPER[operator](`%${value}%`);
      } else {
        options[field] = FILTER_MAPPER[operator](value);
      }
    }

    return options;
  }

  private parseOrderFilter<T extends BaseModel>(
    key: string,
    value: any,
  ): FindOptionsOrder<T> {
    const order: FindOptionsOrder<T> = {};

    /**
     * order는 무조건 두개로 split된다.
     */

    const split = key.split('__');

    if (split.length !== 2) {
      throw new BadRequestException(
        `order 필터는 '__' split 했을때 2어야 합니다. 문제되는 키값 ${key}`,
      );
    }

    const [_, field] = split;

    order[field] = value;

    return order;
  }
}
