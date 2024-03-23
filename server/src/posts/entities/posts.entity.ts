import { IsNumber, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CommentsModel } from '../comments/entities/comments.entity';

@Entity()
export class PostsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  author: UsersModel;

  @Column({ default: 'asdasd' })
  @IsString()
  title: string;

  @Column()
  @IsString()
  content: string;

  @Column('text', { nullable: true, array: true })
  // @Column('text', { nullable: true, array: true })
  @IsString()
  images?: string[];

  @Column({ default: 0 })
  @IsNumber()
  likeCount: number;

  @Column({ default: 0 })
  @IsNumber()
  commentCount: number;

  @OneToMany(() => CommentsModel, (comment) => comment.post)
  comments: CommentsModel[];
}
