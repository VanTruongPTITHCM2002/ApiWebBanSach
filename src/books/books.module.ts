import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Author } from '@/authors/entities/author.entity';
import { Category } from '@/categories/entities/category.entity';
import { Publisher } from '@/publishers/entities/publisher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Author, Category, Publisher])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
