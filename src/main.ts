import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { LoggerService } from './common/logger/logger.service';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(LoggerService);

  // Security
  app.use(helmet());
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:3001',
    methods: ['GET', 'POST'],
  });
  app.use(require('express').json({ limit: '10kb' }));

  // Routing
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });

  // Pipes, interceptors, filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    new LoggingInterceptor(logger),
    new ResponseInterceptor(),
  );
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application running on port ${process.env.PORT ?? 3000}`, 'Bootstrap');
}

bootstrap();