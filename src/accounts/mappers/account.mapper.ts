import { Injectable } from '@nestjs/common';
import { BaseMapper } from '@/common/mappers/base.mapper';
import { convertStatus } from '@/utils/convertStatusAccount';
import { AccountResponse } from '../dto/account.response';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountMapper extends BaseMapper<Account, AccountResponse> {
  toResponse(account: Account): AccountResponse {
    return new AccountResponse(
      account.accountId,
      account.username,
      convertStatus(account.isActive),
      account.createdAt.toLocaleString(),
    );
  }
}
