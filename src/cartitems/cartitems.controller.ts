import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartitemsService } from './cartitems.service';
import { CreateCartitemDto } from './dto/create-cartitem.dto';
import { UpdateCartitemDto } from './dto/update-cartitem.dto';

@Controller('cartitems')
export class CartitemsController {
  constructor(private readonly cartitemsService: CartitemsService) {}

  @Post()
  create(@Body() createCartitemDto: CreateCartitemDto) {
    return this.cartitemsService.create(createCartitemDto);
  }

  @Get()
  findAll() {
    return this.cartitemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartitemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartitemDto: UpdateCartitemDto) {
    return this.cartitemsService.update(+id, updateCartitemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartitemsService.remove(+id);
  }
}
