import { IsEmail, IsEnum, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ProviderEnum, RolesEnum } from '../constant/roles.constant';
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

  @Column({ nullable: true })
  @IsString()
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Column({ type: 'enum', enum: RolesEnum, default: RolesEnum.USER })
  @IsEnum(RolesEnum)
  role: RolesEnum;

  @Column({ type: 'enum', enum: ProviderEnum, default: ProviderEnum.LOCAL })
  @IsEnum(ProviderEnum)
  provider: ProviderEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];
  //
}
