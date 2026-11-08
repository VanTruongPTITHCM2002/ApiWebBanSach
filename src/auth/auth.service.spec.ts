import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@/common/exception/conflict.exception';
import { AuthService } from './auth.service';
import { AccountsRepository } from '@/accounts/repositories/accounts.repository';
import { RolesRepository } from '@/roles/repositories/roles.repository';

describe('AuthService', () => {
  let service: AuthService;
  const accountRepository = {
    findByUsername: jest.fn(),
    createWithProfile: jest.fn(),
  };
  const roleRepository = {
    findByName: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: {} },
        { provide: AccountsRepository, useValue: accountRepository },
        { provide: RolesRepository, useValue: roleRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should propagate a conflict when signing up with an existing username', async () => {
    accountRepository.findByUsername.mockResolvedValue({
      username: 'existing-user',
    });

    await expect(
      service.signup({
        username: 'existing-user',
        password: 'Password123!',
        repassword: 'Password123!',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('should create the account profile when the username is available', async () => {
    accountRepository.findByUsername.mockResolvedValue(null);
    roleRepository.findByName.mockResolvedValue({ roleName: 'USER' });

    await service.signup({
      username: 'new-user',
      password: 'Password123!',
      repassword: 'Password123!',
    });

    expect(accountRepository.findByUsername).toHaveBeenCalledWith(
      'new-user',
      false,
    );
    expect(accountRepository.createWithProfile).toHaveBeenCalledTimes(1);
  });
});
