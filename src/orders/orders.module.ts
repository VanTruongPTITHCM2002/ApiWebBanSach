import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderMapper } from './mappers/order.mapper';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrderMapper],
})
export class OrdersModule {}
