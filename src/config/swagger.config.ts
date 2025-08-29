import { INestApplication } from '@nestjs/common';
import configuration from './configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerConfig(app: INestApplication): void {
  const serverEnvironment = configuration().server.environment;
  const options = new DocumentBuilder()
    .setTitle('Docgen 서비스 API')
    .setDescription(
      `<h1> 백엔드 API </h1>\n <h3> WAS 구동 환경: ${serverEnvironment}`,
    )
    .setVersion('0.0.0')
    .addServer('http://localhost:3100', 'Development server')
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'bearer',
        description: 'JWT Token을 입력해 주세요.',
        in: 'header',
      },
      'token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persisAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Docgen API Documentation',
  });
}
