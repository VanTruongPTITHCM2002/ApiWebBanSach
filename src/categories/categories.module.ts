import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '@/books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Book])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
