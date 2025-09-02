import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 추가
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : [
        'http://localhost:8181', // 로컬 프론트엔드
        'http://localhost:3100', // 로컬 프론트엔드 (다른 포트)
        'https://docgen.aicc-project.com', // 배포된 프론트엔드
        'https://www.docgen.aicc-project.com', // www 서브도메인
      ];

  // CORS 설정을 더 명시적으로
  app.enableCors({
    origin: true, // 모든 origin 허용 (개발 환경)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-API-Key',
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Validation pipe 추가
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 에러
      transform: true, // 자동 타입 변환
    }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('DocGen API')
    .setDescription('DocGen 백엔드 API 문서')
    .setVersion('1.0')
    .addServer('http://localhost:3100', 'Development server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        description: 'JWT Token을 입력해 주세요.',
        in: 'header',
      },
      'token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'DocGen API Documentation',
  });

  await app.listen(process.env.APP_PORT ?? 3100);
}
bootstrap();
