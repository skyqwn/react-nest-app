import { BaseModel } from 'src/common/entities/base.entity';
import { UsersModel } from './users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export type FollowStatus = 'PENDING' | 'CONFIRMED';
@Entity()
export class UserFollowersModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.followers, {
    onDelete: 'CASCADE',
  })
  follower: UsersModel;

  @ManyToOne(() => UsersModel, (user) => user.follwees, {
    onDelete: 'CASCADE',
  })
  followee: UsersModel;

  @Column({
    default: false,
  })
  isConfirmed: boolean;

  @Column({ default: 'PENDING' })
  status: FollowStatus;

  @Column({ nullable: true })
  avatar: string;
}
