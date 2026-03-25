import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';

@Controller()
class AppController {
  @Get()
  getHello() {
    return { message: 'Kasamotos API running' };
  }
}

@Module({
  controllers: [AppController],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();