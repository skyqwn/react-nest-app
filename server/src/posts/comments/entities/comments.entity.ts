import { IsArray, IsNumber, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { LikesModel } from 'src/posts/likes/entities/likes.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class CommentsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.postComments)
  author: UsersModel;

  @ManyToOne(() => PostsModel, (post) => post.comments, { onDelete: 'CASCADE' })
  post: PostsModel;

  @Column()
  @IsString()
  comment: string;

  @Column({ default: 0 })
  @IsNumber()
  likeCount: number;

  @OneToMany(() => LikesModel, (like) => like.comment)
  like: LikesModel;

  @Column('text', { array: true, default: [] })
  commentLikeUsers: number[];
}
