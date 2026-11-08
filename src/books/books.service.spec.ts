import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { BooksRepository } from './repositories/books.repository';
import { AuthorsRepository } from '@/authors/repositories/authors.repository';
import { PublishersRepository } from '@/publishers/repositories/publishers.repository';
import { CategoriesRepository } from '@/categories/repositories/categories.repository';
import { BookMapper } from './mappers/book.mapper';

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: BooksRepository, useValue: {} },
        { provide: AuthorsRepository, useValue: {} },
        { provide: PublishersRepository, useValue: {} },
        { provide: CategoriesRepository, useValue: {} },
        BookMapper,
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
