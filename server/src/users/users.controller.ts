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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInput } from './dtos/creat-user.dto';
import { AuthUser } from './decorator/auth-user.decorator';
import { UsersModel } from './entities/users.entity';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.intercepter';
import { QueryRunnerDecorator } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner } from 'typeorm';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CommonService } from 'src/common/common.service';
import { EditUserInput } from './dtos/edit-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly commonService: CommonService,
  ) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getFindById(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.getUserById(userId);
  }

  @Patch('edit/:id')
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(FilesInterceptor('files', 1))
  // @UseInterceptors(FileInterceptor('image'))
  async editUser(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    // @UploadedFile() files: Express.Multer.File,
    @QueryRunnerDecorator() qr: QueryRunner,
    @Body() body: EditUserInput,
  ) {
    const imageUrl: string[] = [];
    await Promise.all(
      files.map(async (file) => {
        const url = await this.commonService.fileUpload(file);
        imageUrl.push(url);
      }),
    );
    return this.usersService.editUser(id, body, imageUrl);
  }

  @Post()
  createUser(@Body() createUserInput: CreateUserInput) {
    return this.usersService.createUser(createUserInput);
  }

  //나한테 팔로워 요청 들어온것들
  @Get('requestFollow/me')
  async requsetFollow(@AuthUser() user: UsersModel) {
    return await this.usersService.requsetFollow(user.id);
  }

  //나를 팔로워하고있는 사람들 followerModal
  @Get('follow/me/:id')
  async getFollow(
    @Param('id', ParseIntPipe) id: number,
    @Query('includeNotConfirmed', new DefaultValuePipe(false), ParseBoolPipe)
    includeNotConfirmed: boolean,
  ) {
    return await this.usersService.getFollowers(id);
  }

  //내가 팔로잉 하고 있는 사람들 folloingModl
  @Get('followee/me/:id')
  async getFollowee(
    // @AuthUser() user: UsersModel,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.usersService.getFollowings(id);
  }

  //내 팔로워 목록에서 삭제 팔로워 끊기
  @Delete('follow/me/:id')
  @UseInterceptors(TransactionInterceptor)
  async myFollowerDelete(
    @Param('id', ParseIntPipe) followerId: number,
    @AuthUser() user: UsersModel,
    @QueryRunnerDecorator() qr: QueryRunner,
  ) {
    await this.usersService.myFollowerDelete(followerId, user.id, qr);
    await this.usersService.decrementFollowerCount(user.id, qr);
    await this.usersService.decrementFolloweeCount(followerId, qr);

    return true;
  }

  // 내 팔로잉 모달 목록에서 삭제 // 팔로잉 끊기
  @Delete('following/me/:id')
  @UseInterceptors(TransactionInterceptor)
  async myFolloweeDelete(
    @Param('id', ParseIntPipe) followerId: number,
    @AuthUser() user: UsersModel,
    @QueryRunnerDecorator() qr: QueryRunner,
  ) {
    await this.usersService.myFollowerDelete(followerId, user.id, qr);
    await this.usersService.decrementFolloingModalCount(user.id, qr);
    await this.usersService.decrementFollwerModalCount(followerId, qr);

    return true;
  }

  //내가 팔로잉하고 있는 특정 사람
  @Get('followee/:id')
  async getFolloweeById(
    @AuthUser() user: UsersModel,
    @Param('id', ParseIntPipe) followeeId: number,
  ) {
    return await this.usersService.getFolloweeById(user.id, followeeId);
  }

  //팔로우 요청
  @Post('follow/:id')
  async postFollow(
    @AuthUser() user: UsersModel,
    @Param('id', ParseIntPipe) followerId: number,
  ) {
    return await this.usersService.followUser(followerId, user.id);
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
  }

  @Patch('follow/:id')
  @UseInterceptors(TransactionInterceptor)
  async patchFollow(
    @AuthUser() user: UsersModel,
    @Param('id', ParseIntPipe) id: number,
    @QueryRunnerDecorator() qr: QueryRunner,
  ) {
    const result = await this.usersService.patchFollow(id, user.id);
    await this.usersService.incrementFollweeCount(result.followeeId, qr);
    await this.usersService.incrementFollowerCount(user.id, qr);

    return true;
  }

  //팔로우 요청들어온 상대방의 팔로우 취소
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

  @Get('/postbyuser/:id')
  async postByUser(@Param('id', ParseIntPipe) userId: number) {
    return await this.usersService.postByUser(userId);
  }

  @Get('postlikebyuser/:id')
  async postLikeByUser(@Param('id', ParseIntPipe) userId: number) {
    return await this.usersService.postByLikeUser(userId);
  }
}
