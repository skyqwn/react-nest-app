import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateUserInput } from './dtos/creat-user.dto';
import { UserFollowersModel } from './entities/user-followers.entity';
import { EditUserInput } from './dtos/edit-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    @InjectRepository(UserFollowersModel)
    private readonly userFollowersRepository: Repository<UserFollowersModel>,
  ) {}

  getUsersRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<UsersModel>(UsersModel)
      : this.usersRepository;
  }

  getUserFolloweRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<UserFollowersModel>(UserFollowersModel)
      : this.userFollowersRepository;
  }

  async createUser({
    email,
    nickname,
    password,
    avatar,
    provider,
  }: CreateUserInput) {
    try {
      const emailExists = await this.usersRepository.exists({
        where: {
          email,
        },
      });

      if (emailExists) {
        return {
          ok: false,
          error: '이미 존재하는 이메일입니다.',
        };
      }
      //
      const nicknameExists = await this.usersRepository.exists({
        where: {
          nickname,
        },
      });

      if (nicknameExists) {
        return {
          ok: false,
          error: '이미 존재하는 닉네임입니다.',
        };
      }

      const newUser = await this.usersRepository.save(
        this.usersRepository.create({
          email,
          nickname,
          password,
          avatar,
          provider,
        }),
      );

      return {
        ok: true,
        user: newUser,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '계정 생성을 실패하였습니다.',
      };
    }
  }

  async editUser(
    userId: number,
    { nickname }: EditUserInput,
    imageUrl: string[],
  ) {
    await this.usersRepository.update(
      {
        id: userId,
      },
      { nickname, avatar: imageUrl[0] },
    );

    return true;
  }

  async getAllUsers() {
    return this.usersRepository.find({});
  }

  async getUserById(id: number) {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }
  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async followUser(followerId: number, userId: number, qr?: QueryRunner) {
    const userFollowersRepository = this.getUserFolloweRepository(qr);

    const result = await userFollowersRepository.save({
      follower: {
        id: followerId,
      },
      followee: {
        id: userId,
      },
    });

    return result;
  }

  //followee가 받은사람

  async patchFollow(followId: number, userId: number) {
    const follow = await this.userFollowersRepository.findOne({
      where: {
        id: followId,
      },
      relations: {
        followee: true,
        follower: true,
      },
    });
    if (follow.followee.id !== userId) {
      throw new BadRequestException('잘못된 접근입니다.');
    }
    follow.status = 'CONFIRMED';
    await this.userFollowersRepository.save(follow);
    return { followeeId: follow.followee.id, followerId: follow.follower.id };
  }

  //내가 팔로워 요청받은거
  async getFollowees(userId: number) {
    const result = await this.userFollowersRepository.find({
      where: {
        follower: {
          id: userId,
        },
      },
      relations: {
        followee: true,
      },
    });
    return result;
  }

  async getFolloweeById(userId: number, followeeId: number) {
    const result = await this.userFollowersRepository.findOne({
      where: {
        follower: { id: userId },
        followee: { id: followeeId },
      },
    });

    return result;
  }

  async getFollowers(userId: number, includeNotConfirmed: boolean) {
    const where = {
      followee: {
        id: userId,
      },
    };

    if (!includeNotConfirmed) {
      where['isConfirmed'] = true;
    }

    const result = await this.userFollowersRepository.find({
      where,
      relations: {
        follower: true,
        followee: true,
      },
    });

    return result.map((user) => ({
      id: user.follower.id,
      nickname: user.follower.nickname,
      email: user.follower.email,
      isConfirmed: user.isConfirmed,
      avatar: user.avatar,
    }));
  }

  async confirmFollow(
    followerId: number,
    followeeId: number,
    qr?: QueryRunner,
  ) {
    const userFollowersRepository = this.getUserFolloweRepository(qr);
    const existing = await userFollowersRepository.findOne({
      where: {
        follower: {
          id: followerId,
        },
        followee: {
          id: followeeId,
        },
      },
      relations: {
        follower: true,
        followee: true,
      },
    });

    if (!existing) {
      throw new BadRequestException(`존재하지 않는 팔로우 요청입니다.`);
    }

    await this.userFollowersRepository.save({
      ...existing,
      isConfirmed: true,
    });

    return true;
  }

  async deleteFollow(followerId: number, followeeId: number, qr?: QueryRunner) {
    const userFollowersRepository = this.getUserFolloweRepository(qr);
    try {
      await userFollowersRepository.delete({
        follower: {
          id: followerId,
        },
        followee: {
          id: followeeId,
        },
      });

      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async incrementFollowerCount(userId: number, qr?: QueryRunner) {
    const usersRepository = this.getUsersRepository(qr);

    await usersRepository.increment(
      {
        id: userId,
      },
      'followerCount',
      1,
    );
  }

  async decrementFollowerCount(userId: number, qr?: QueryRunner) {
    const usersRepository = this.getUsersRepository(qr);

    await usersRepository.decrement(
      {
        id: userId,
      },
      'followerCount',
      1,
    );
  }

  async incrementFollweeCount(followeeId: number, qr?: QueryRunner) {
    const userRepository = this.getUsersRepository(qr);

    await userRepository.increment(
      {
        id: followeeId,
      },
      'followeeCount',
      1,
    );
  }

  async decrementFolloweeCount(followeeId: number, qr?: QueryRunner) {
    const userRepository = this.getUsersRepository(qr);

    await userRepository.decrement(
      {
        id: followeeId,
      },
      'followeeCount',
      1,
    );
  }
}
