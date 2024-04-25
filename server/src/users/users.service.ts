import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateUserInput } from './dtos/creat-user.dto';
import { UserFollowersModel } from './entities/user-followers.entity';
import { EditUserInput } from './dtos/edit-user.dto';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    @InjectRepository(UserFollowersModel)
    private readonly userFollowersRepository: Repository<UserFollowersModel>,
    private readonly postsService: PostsService,
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
  async patchFollow(followId: number, userId: number, qr?: QueryRunner) {
    const userFollowersRepository = this.getUserFolloweRepository(qr);
    const follow = await userFollowersRepository.findOne({
      where: {
        id: followId,
      },
      relations: {
        followee: true,
        follower: true,
      },
    });
    if (follow.follower.id !== userId) {
      throw new BadRequestException('잘못된 접근입니다.');
    }
    follow.status = 'CONFIRMED';
    await this.userFollowersRepository.save(follow);
    return { followeeId: follow.followee.id, followerId: follow.follower.id };
  }

  //나에게 팔로우 요청한 사람들 목록
  async requsetFollow(userId: number) {
    try {
      const result = await this.userFollowersRepository.find({
        where: {
          follower: {
            id: userId,
          },
          status: 'PENDING',
        },
        relations: {
          followee: true,
        },
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  //내가 팔로잉하고있는 사람들
  async getFollowings(userId: number) {
    const result = await this.userFollowersRepository.find({
      where: {
        followee: {
          id: userId,
        },
      },
      relations: {
        follower: true,
      },
    });
    return result;
  }

  //나를 팔로워하고 있는 사람들
  async getFollowers(userId: number) {
    const result = await this.userFollowersRepository.find({
      where: {
        follower: {
          id: userId,
        },
        status: 'CONFIRMED',
      },
      relations: {
        followee: true,
      },
    });
    return result;
  }

  //나를 팔로워하고있는 사람 팔로워 끊기
  async myFollowerDelete(followerId: number, userId: number, qr?: QueryRunner) {
    try {
      const userFollowersRepository = this.getUserFolloweRepository(qr);
      await userFollowersRepository.delete({
        id: followerId,
      });
    } catch (error) {
      console.log(error);
    }
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

  //팔로워 모달에서 -1
  async decrementFolloweeCount(followeeId: number, qr?: QueryRunner) {
    try {
      const follower = await this.userFollowersRepository.findOne({
        where: {
          id: followeeId,
        },
        relations: {
          followee: true,
        },
      });

      const userRepository = this.getUsersRepository(qr);

      await userRepository.decrement(
        {
          id: follower.followee.id,
        },
        'followeeCount',
        1,
      );
    } catch (error) {
      console.log(error);
    }
  }

  //내 팔로잉목록에서 팔루잉 삭제했을경우 -1
  async decrementFolloingModalCount(userId: number, qr?: QueryRunner) {
    const usersRepository = this.getUsersRepository(qr);

    await usersRepository.decrement(
      {
        id: userId,
      },
      'followeeCount',
      1,
    );

    return true;
  }

  //상대방이 자신팔로잉목록에서 나를 팔로잉을 끊었을때 내 팔로워목록 -1
  async decrementFollwerModalCount(followerId: number, qr?: QueryRunner) {
    try {
      const result = await this.userFollowersRepository.findOne({
        where: {
          id: followerId,
        },
        relations: { follower: true },
      });
      await this.usersRepository.decrement(
        {
          id: result.follower.id,
        },
        'followerCount',
        1,
      );
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async postByUser(userId: number) {
    try {
      const result = await this.postsService.getPostByUserId(userId);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async postByLikeUser(userId: number) {
    try {
      const result = await this.postsService.getPostLikeByUserId(userId);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  //

  async recommendationUser(userId: number) {
    console.log(userId);
    try {
      const result = await this.usersRepository
        .createQueryBuilder()
        .select(['id', 'nickname', 'avatar'])
        .where('id != :userId', { userId })
        .orderBy('RANDOM()')
        .take(3)
        .getRawMany();
      return result;

      // const filteredResult = result.filter((user) => user.id !== userId);

      // console.log(filteredResult);
      // return filteredResult;
    } catch (error) {
      console.log(error);
    }
  }
}
