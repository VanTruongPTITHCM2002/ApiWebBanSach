import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { AuthorsRepository } from './repositories/authors.repository';
import { AuthorMapper } from './mappers/author.mapper';

describe('AuthorsService', () => {
  let service: AuthorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        { provide: AuthorsRepository, useValue: {} },
        AuthorMapper,
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
