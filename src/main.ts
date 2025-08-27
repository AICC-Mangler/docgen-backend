import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 추가
  const corsOrigins = process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : [
        'http://localhost:5173', // 로컬 프론트엔드
        'http://localhost:3100', // 로컬 프론트엔드 (다른 포트)
        'https://docgen.aicc-project.com', // 배포된 프론트엔드
        'https://www.docgen.aicc-project.com', // www 서브도메인
      ];

  app.enableCors({
    origin: corsOrigins,
    credentials: true, // 쿠키, 인증 헤더 허용
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-API-Key',
    ],
  });

  // Validation pipe 추가
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 에러
      transform: true, // 자동 타입 변환
    }),
  );
  
  await app.listen(process.env.APP_PORT ?? 3100);
}
bootstrap();
