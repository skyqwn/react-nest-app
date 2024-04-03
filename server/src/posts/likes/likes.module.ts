import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesModel } from './entities/likes.entity';
import { PostsModule } from '../posts.module';
import { CommentsModule } from '../comments/comments.module';
import { PostsModel } from '../entities/posts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikesModel, PostsModel]),
    PostsModule,
    CommentsModule,
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
