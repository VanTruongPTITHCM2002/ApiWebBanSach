import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Publisher } from 'src/publishers/entities/publisher.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Author } from 'src/authors/entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Author, Category, Publisher])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
