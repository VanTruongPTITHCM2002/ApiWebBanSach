import { Module } from '@nestjs/common';
import { OrderdetailService } from './orderdetail.service';
import { OrderdetailController } from './orderdetail.controller';
import { OrderdetailMapper } from './mappers/orderdetail.mapper';

@Module({
  controllers: [OrderdetailController],
  providers: [OrderdetailService, OrderdetailMapper],
})
export class OrderdetailModule {}
