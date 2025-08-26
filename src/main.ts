import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Validation pipe 추가
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // DTO에 정의되지 않은 속성 제거
    forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 에러
    transform: true, // 자동 타입 변환
  }));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
