import { BaseModel } from 'src/common/entities/base.entity';
import { CommentsModel } from 'src/posts/comments/entities/comments.entity';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class LikesModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.likePosts)
  author: UsersModel;

  @ManyToOne(() => PostsModel, (post) => post.likes)
  post: PostsModel;

  // @ManyToOne(() => CommentsModel, (comment) => comment.like)
  // comment: CommentsModel;
}
