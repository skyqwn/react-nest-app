import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesModel } from './entities/likes.entity';
import { PostsModule } from '../posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([LikesModel]), PostsModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
