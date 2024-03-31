import { IsEmail, IsEnum, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { ProviderEnum, RolesEnum } from '../constant/roles.constant';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { Exclude } from 'class-transformer';
import { CommentsModel } from 'src/posts/comments/entities/comments.entity';
import { UserFollowersModel } from './user-followers.entity';
import { LikesModel } from 'src/posts/likes/entities/likes.entity';

@Entity()
export class UsersModel extends BaseModel {
  @Column({ length: 20, unique: true })
  @IsString()
  nickname: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  @IsString()
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Column({ default: null })
  @IsString()
  avatar: string;

  @Column({ type: 'enum', enum: RolesEnum, default: RolesEnum.USER })
  @IsEnum(RolesEnum)
  role: RolesEnum;

  @Column({ type: 'enum', enum: ProviderEnum, default: ProviderEnum.LOCAL })
  @IsEnum(ProviderEnum)
  provider: ProviderEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];
  //

  @OneToMany(() => CommentsModel, (comment) => comment.author)
  postComments: CommentsModel[];

  // 내가 팔로워 하고 있는 사람
  @OneToMany(
    () => UserFollowersModel,
    (userFollowersModel) => userFollowersModel.follower,
  )
  followers: UserFollowersModel[];

  // 나를 팔로워하고 있는 사람
  @OneToMany(
    () => UserFollowersModel,
    (userFollowersModel) => userFollowersModel.followee,
  )
  follwees: UserFollowersModel[];

  // // 나를 팔로워하고 있는 사람
  @Column({ default: 0 })
  followerCount: number;

  // // 내가 팔로워 하고 있는 사람
  @Column({ default: 0 })
  followeeCount: number;

  @OneToMany(() => LikesModel, (like) => like.author)
  likePosts: LikesModel[];

  // @ManyToMany(() => UsersModel, (user) => user.follwees)
  // @JoinTable()
  // followers: UsersModel[];

  // @ManyToMany(() => UsersModel, (user) => user.followers)
  // follwees: UsersModel[];
}
