import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(process.env.APP_PORT ?? 8100);
}
bootstrap();
