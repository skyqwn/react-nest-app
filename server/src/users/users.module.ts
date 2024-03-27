import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { UserFollowersModel } from './entities/user-followers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersModel, UserFollowersModel])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
