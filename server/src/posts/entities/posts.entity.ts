import { IsNumber, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class PostsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  author: UsersModel;

  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  content: string;

  @Column({ default: 0 })
  @IsNumber()
  likeCount: number;

  @Column({ default: 0 })
  @IsNumber()
  commentCount: number;
}
