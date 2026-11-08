import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { RolesRepository } from './repositories/roles.repository';

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService, { provide: RolesRepository, useValue: {} }],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
