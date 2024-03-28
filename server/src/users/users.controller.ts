import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInput } from './dtos/creat-user.dto';
import { AuthUser } from './decorator/auth-user.decorator';
import { UsersModel } from './entities/users.entity';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.intercepter';
import { QueryRunnerDecorator } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getFindById(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.getUserById(userId);
  }

  @Post()
  createUser(@Body() createUserInput: CreateUserInput) {
    return this.usersService.createUser(createUserInput);
  }

  //내가 팔로잉하고있는 사람들
  @Get('follow/me')
  async getFollow(
    @AuthUser() user: UsersModel,
    @Query('includeNotConfirmed', new DefaultValuePipe(false), ParseBoolPipe)
    includeNotConfirmed: boolean,
  ) {
    return await this.usersService.getFollowers(user.id, includeNotConfirmed);
  }

  //내가 팔로잉 하고 있는 사람들
  @Get('followee/me')
  async getFollowee(@AuthUser() user: UsersModel) {
    return await this.usersService.getFollowees(user.id);
  }
  //내가 팔로잉하고 있는 특정 사람
  @Get('followee/:id')
  async getFolloweeById(
    @AuthUser() user: UsersModel,
    @Param('id', ParseIntPipe) followeeId: number,
  ) {
    return await this.usersService.getFolloweeById(user.id, followeeId);
  }

  @Get('follow/me/confirm')
  async getConfirmFollow(@AuthUser() user: UsersModel) {
    return await this.usersService.getConfirmFollow(user.id);
  }

  @Post('follow/:id')
  async postFollow(
    @AuthUser() user: UsersModel,
    @Param('id', ParseIntPipe) followeeId: number,
  ) {
    return await this.usersService.followUser(user.id, followeeId);
  }

  @Patch('follow/:id/confirm')
  @UseInterceptors(TransactionInterceptor)
  async patchFollowConfirm(
    @AuthUser() user: UsersModel,
    @QueryRunnerDecorator() qr: QueryRunner,
    // 나를 팔로워하려는 상대방 아이디
    @Param('id', ParseIntPipe) followerId: number,
  ) {
    await this.usersService.confirmFollow(followerId, user.id, qr);

    await this.usersService.incrementFollowerCount(user.id, qr);
    await this.usersService.incrementFollweeCount(followerId, qr);
    return true;
  }

  //내가 팔로워한 상대방의 팔로우 취소
  @Delete('follow/:id')
  @UseInterceptors(TransactionInterceptor)
  async deleteFollow(
    @AuthUser() user: UsersModel,
    @QueryRunnerDecorator() qr: QueryRunner,
    @Param('id', ParseIntPipe) followeeId: number,
  ) {
    console.log('followeeID' + followeeId);
    console.log('userID' + user.id);

    await this.usersService.deleteFollow(user.id, followeeId, qr);

    await this.usersService.decrementFollowerCount(user.id, qr);
    await this.usersService.decrementFolloweeCount(followeeId, qr);
    return true;
  }
}
