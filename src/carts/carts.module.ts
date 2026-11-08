import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { CartMapper } from './mappers/cart.mapper';

@Module({
  controllers: [CartsController],
  providers: [CartsService, CartMapper],
})
export class CartsModule {}
