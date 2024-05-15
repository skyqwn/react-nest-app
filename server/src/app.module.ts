import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import * as Joi from 'joi';
import { PostsModel } from './posts/entities/posts.entity';
import { UsersModule } from './users/users.module';
import { UsersModel } from './users/entities/users.entity';
import { AuthModule } from './auth/auth.module';
import { LogMiddleware } from './middleware/log.middleware';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './users/guard/roles.guard';
import { AccessTokenGuard } from './auth/guard/bearer-token.guard';
import { CommentsModule } from './posts/comments/comments.module';
import { CommentsModel } from './posts/comments/entities/comments.entity';
import { UserFollowersModel } from './users/entities/user-followers.entity';
import { LikesModule } from './posts/likes/likes.module';
import { LikesModel } from './posts/likes/entities/likes.entity';
import { ChatsModule } from './chats/chats.module';
import { ChatsModel } from './chats/entity/chats.entity';
import { MessagesModel } from './chats/messages/entity/messages.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      // envFilePath: process.env.NODE_ENV == 'dev' ? '.env.dev' : '.env.prod',
      // ignoreEnvFile: process.env.NODE_ENV === 'prod',
      // validationSchema: Joi.object({
      //   NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
      //   DB_HOST: Joi.string().required(),
      //   DB_PORT: Joi.string().required(),
      //   DB_USERNAME: Joi.string().required(),
      //   DB_PASSWORD: Joi.string().required(),
      //   DB_NAME: Joi.string().required(),
      //   JWT_SECRET: Joi.string().required(),
      //   HASH_ROUNDS: Joi.number().required(),
      //   PROTOCOL: Joi.string().required(),
      //   HOST: Joi.string().required(),
      //   GOOGLE_CLIENT_ID: Joi.string().required(),
      //   GOOGLE_SECRET: Joi.string().required(),
      //   GOOGLE_OAUTH_REDIRECT_URL: Joi.string().required(),
      //   AWS_BUCKET_ACCESS_KEY: Joi.string().required(),
      //   AWS_BUCKET_SECRET_ACCESS_KEY: Joi.string().required(),
      //   AWS_S3_REGION: Joi.string().required(),
      //   AWS_BUCKET_NAME: Joi.string().required(),
      // }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_ROOT_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      // host: process.env.DB_HOST,
      // port: +process.env.DB_PORT,
      // username: process.env.DB_USER,
      // password: process.env.DB_PASSWORD,
      // database: process.env.DB_NAME,
      entities: [
        PostsModel,
        UsersModel,
        CommentsModel,
        UserFollowersModel,
        LikesModel,
        ChatsModel,
        MessagesModel,
      ],
      synchronize: process.env.NODE_ENV !== 'prod',
    }),
    PostsModule,
    CommonModule,
    UsersModule,
    AuthModule,
    CommentsModule,
    LikesModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
