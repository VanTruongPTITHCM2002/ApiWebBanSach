import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { AccountsRepository } from './repositories/accounts.repository';
import { RolesRepository } from '@/roles/repositories/roles.repository';
import { AccountMapper } from './mappers/account.mapper';

describe('AccountsService', () => {
  let service: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        { provide: AccountsRepository, useValue: {} },
        { provide: RolesRepository, useValue: {} },
        AccountMapper,
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
