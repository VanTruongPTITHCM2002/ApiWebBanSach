/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
// import { ApiExceptionFilter } from './common/filters/api.filter';
import * as cookieParser from 'cookie-parser';
import { GlobalHandlerException } from './common/exception/global-exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
});
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
     exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((acc, error) => {
          acc[error.property] = Object.values(error.constraints)[0];
          return acc;
        },{});

      return new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        formattedErrors,
      });
    },
  }),
);

app.useGlobalFilters(new GlobalHandlerException());
const config = new DocumentBuilder()
.setTitle('Bookshop API')
.setDescription('The API Bookshop description')
.setVersion('1.0')
.addBearerAuth()
.build();
await app.init();
const documentFactory = () => SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, documentFactory);
  await app.listen(PORT);
}
bootstrap();
