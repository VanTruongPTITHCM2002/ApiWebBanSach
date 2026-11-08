import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { BookMapper } from './mappers/book.mapper';

@Module({
  controllers: [BooksController],
  providers: [BooksService, BookMapper],
})
export class BooksModule {}
