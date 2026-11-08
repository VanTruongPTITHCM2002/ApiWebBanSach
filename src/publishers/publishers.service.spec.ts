import { Test, TestingModule } from '@nestjs/testing';
import { PublishersService } from './publishers.service';
import { PublishersRepository } from './repositories/publishers.repository';
import { PublisherMapper } from './mappers/publisher.mapper';

describe('PublishersService', () => {
  let service: PublishersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublishersService,
        { provide: PublishersRepository, useValue: {} },
        PublisherMapper,
      ],
    }).compile();

    service = module.get<PublishersService>(PublishersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
