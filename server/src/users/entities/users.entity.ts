import { IsEmail, IsEnum, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RolesEnum } from '../constant/roles.constant';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class UsersModel extends BaseModel {
  @Column({ length: 20, unique: true })
  @IsString()
  nickname: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @Column({ type: 'enum', enum: RolesEnum, default: RolesEnum.USER })
  @IsEnum(RolesEnum)
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];
  //
}
