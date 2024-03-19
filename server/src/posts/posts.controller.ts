import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostInput } from './dtos/create-posts.dto';
import { AuthUser } from 'src/users/decorator/auth-user.decorator';
import { UpdatePostInput } from './dtos/update-posts.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { PaginatePostsDto } from './dtos/paginate-post.dto';
import { UsersModel } from 'src/users/entities/users.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { returnCurrentDate } from './util/currentDate';
import s3PutImage from './util/s3PutImage';
import { ResizeImagePipe } from './pipes/resize-image.pipe';
import sharp from 'sharp';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @IsPublic()
  getPosts(@Query() query: PaginatePostsDto) {
    return this.postsService.paginatePosts(query);
  }

  @Post('random')
  async postPostsRandom(@AuthUser() user: UsersModel) {
    await this.postsService.generatePosts(user.id);
  }

  @Get(':id')
  @IsPublic()
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostId(id);
  }

  @Post('test')
  @IsPublic()
  @UseInterceptors(FilesInterceptor('file'))
  async uploadFile(@UploadedFiles() file: Express.Multer.File) {
    console.log(file);
    const s3Config = new S3Client({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const objectName = `${returnCurrentDate() + file[0].originalname}`;
    const input = {
      Body: file[0].buffer,
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: objectName,
    };
    console.log(input);
    await s3Config.send(new PutObjectCommand(input));
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
    return { url };
  }
  //
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async postPosts(
    @AuthUser('id') userId: number,
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createPostInput: CreatePostInput,
    @Req() req: Request & { files: Express.Multer.File[] },
  ) {
    console.log(images);

    const s3Config = new S3Client({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const objectName = `${returnCurrentDate() + images[0].originalname}`;

    const sharpImage = await sharp(images[0].buffer)
      .resize(1280)
      .toFormat('webp')
      .toBuffer();

    const input = {
      Body: sharpImage,
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: objectName,
    };
    await s3Config.send(new PutObjectCommand(input));

    // const location = await s3PutImage({
    //   file: images[0],
    //   resizeWidth: 1280,
    // });
    // console.log(location);
    // images.map(async (image) => {
    //   const location = await s3PutImage({
    //     // folderName: createPostInput.title,
    //     // type: 'GALLERY',
    //     file: image,
    //     resizeWidth: 1280,
    //   });
    //   console.log(location);
    // });

    // console.log(images.length);
    // let newImageArr: any = new Array();

    //   // if (i === 0) {
    //   //   newImageArr.thumbnail = location;
    //   // }
    //   // images.push(location);
    // }
    // console.log(multerfiles);
    // const s3Config = new S3Client({
    //   region: process.env.AWS_S3_REGION,
    //   credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //   },
    // });
    // const objectName = `${returnCurrentDate() + images.originalname}`;
    // const input = {
    //   Body: images.buffer,
    //   Bucket: process.env.AWS_BUCKET_NAME,
    //   Key: objectName,
    // };
    // await s3Config.send(new PutObjectCommand(input));
    // const url = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
    // this
  }

  //   return { url };
  // }
  //   return this.postsService.createPost(userId, createPostInput);
  // }

  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostInput: UpdatePostInput,
  ) {
    return this.postsService.updatePost(updatePostInput, id);
  }
}
