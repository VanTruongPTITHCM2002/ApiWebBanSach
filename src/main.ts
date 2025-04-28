/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');
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
const config = new DocumentBuilder()
.setTitle('Bookshop API')
.setDescription('The API Bookshop description')
.setVersion('1.0')
.addBearerAuth()
.build();

const documentFactory = () => SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, documentFactory);
  await app.listen(PORT);
}
bootstrap();
