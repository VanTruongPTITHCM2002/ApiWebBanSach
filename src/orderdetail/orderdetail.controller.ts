import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderdetailService } from './orderdetail.service';
import { CreateOrderdetailDto } from './dto/create-orderdetail.dto';
import { UpdateOrderdetailDto } from './dto/update-orderdetail.dto';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';

@Controller('orderdetail')
export class OrderdetailController {
  constructor(private readonly orderdetailService: OrderdetailService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createOrderdetailDto: CreateOrderdetailDto) {
    return this.orderdetailService.create(createOrderdetailDto);
  }

  @Get()
  findAll() {
    return this.orderdetailService.findAll();
  }

  @Get('/top/books')
  getTopBooks() {
    return this.orderdetailService.getTopFiveBooks();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderdetailService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderdetailDto: UpdateOrderdetailDto,
  ) {
    return this.orderdetailService.update(id, updateOrderdetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderdetailService.remove(+id);
  }
}
