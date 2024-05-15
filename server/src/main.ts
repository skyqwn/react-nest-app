import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // class-validator옵션을 보고 자동으로 변환하고 데코레이터 통과
      },
      whitelist: true, // 데코레이터에 적용이 안된 값들은 입력되지않고 삭제해버린다
      forbidNonWhitelisted: true, // whitelist에대한 에러값들을 반환해준다.
    }),
  );

  app.enableCors({
    origin: [
      'http://react-nest-test-docker-app-env.eba-sfwdaamt.ap-northeast-2.elasticbeanstalk.com/',
    ],
    // origin: ['*'],
    credentials: true,
    exposedHeaders: ['Authorization'], // * 사용할 헤더 추가.
  });
  app.use(cookieParser());
  app.setGlobalPrefix('/api');
  await app.listen(5000);
}

bootstrap();
