import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoryMapper } from './mappers/category.mapper';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryMapper],
})
export class CategoriesModule {}
