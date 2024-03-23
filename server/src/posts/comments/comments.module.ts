import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModel } from './entities/comments.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from '../posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommentsModel]), CommonModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
