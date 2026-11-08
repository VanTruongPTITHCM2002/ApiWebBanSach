import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './repositories/categories.repository';
import { BooksRepository } from '@/books/repositories/books.repository';
import { CategoryMapper } from './mappers/category.mapper';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: CategoriesRepository, useValue: {} },
        { provide: BooksRepository, useValue: {} },
        CategoryMapper,
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
