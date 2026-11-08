import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AccountMapper } from './mappers/account.mapper';

@Module({
  providers: [AccountsService, AccountMapper],
  controllers: [AccountsController],
  exports: [AccountsService],
})
export class AccountsModule {}
