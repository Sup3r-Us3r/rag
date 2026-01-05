// biome-ignore assist/source/organizeImports: <OpenTelemetry needs to patch modules before they are loaded>
import tracer from './tracer';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './presentation/modules/app-module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import basicAuth from 'express-basic-auth';

async function bootstrap() {
  // Start OpenTelemetry tracer before creating the NestJS app
  await tracer.start();

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const swaggerUser = configService.get<string>('SWAGGER_USER') ?? 'root';
  const swaggerPassword =
    configService.get<string>('SWAGGER_PASSWORD') ?? 'toor';

  // Protect /docs routes with HTTP Basic Auth
  app.use(
    '/docs',
    basicAuth({
      challenge: true,
      users: { [swaggerUser]: swaggerPassword },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('POC API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs/swagger', app, document); // Swagger UI at /docs/swagger

  // Scalar API Reference at /docs
  app.use(
    '/docs',
    apiReference({
      content: document,
      theme: 'bluePlanet',
      expandAllResponses: true,
    }),
  );

  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
