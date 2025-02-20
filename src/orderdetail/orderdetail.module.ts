import { Module } from '@nestjs/common';
import { OrderdetailService } from './orderdetail.service';
import { OrderdetailController } from './orderdetail.controller';

@Module({
  controllers: [OrderdetailController],
  providers: [OrderdetailService],
})
export class OrderdetailModule {}
