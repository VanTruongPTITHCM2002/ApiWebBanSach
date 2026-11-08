import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { ReviewsRepository } from './repositories/reviews.repository';
import { BooksRepository } from '@/books/repositories/books.repository';
import { AccountsRepository } from '@/accounts/repositories/accounts.repository';

describe('ReviewsService', () => {
  let service: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: ReviewsRepository, useValue: {} },
        { provide: BooksRepository, useValue: {} },
        { provide: AccountsRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
