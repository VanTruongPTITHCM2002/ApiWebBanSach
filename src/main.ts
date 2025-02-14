/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
});
app.useGlobalPipes(
  new ValidationPipe({
    transform: true, // Quan trọng! Bật transform để DTO hoạt động
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
  await app.listen(5000);
}
bootstrap();
