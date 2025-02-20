import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderdetailService } from './orderdetail.service';
import { CreateOrderdetailDto } from './dto/create-orderdetail.dto';
import { UpdateOrderdetailDto } from './dto/update-orderdetail.dto';

@Controller('orderdetail')
export class OrderdetailController {
  constructor(private readonly orderdetailService: OrderdetailService) {}

  @Post()
  create(@Body() createOrderdetailDto: CreateOrderdetailDto) {
    return this.orderdetailService.create(createOrderdetailDto);
  }

  @Get()
  findAll() {
    return this.orderdetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderdetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderdetailDto: UpdateOrderdetailDto) {
    return this.orderdetailService.update(+id, updateOrderdetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderdetailService.remove(+id);
  }
}
