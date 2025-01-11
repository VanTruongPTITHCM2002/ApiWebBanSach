import { Module } from '@nestjs/common';
import { CartitemsService } from './cartitems.service';
import { CartitemsController } from './cartitems.controller';

@Module({
  controllers: [CartitemsController],
  providers: [CartitemsService],
})
export class CartitemsModule {}
