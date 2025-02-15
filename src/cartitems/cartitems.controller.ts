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
import { CartitemsService } from './cartitems.service';
import { CreateCartitemDto } from './dto/create-cartitem.dto';
import { UpdateCartitemDto } from './dto/update-cartitem.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorators';

@Controller('cartitems')
export class CartitemsController {
  constructor(private readonly cartitemsService: CartitemsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCartitemDto: CreateCartitemDto) {
    return this.cartitemsService.create(createCartitemDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.cartitemsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') username: string) {
    return this.cartitemsService.findOne(username);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCartitemDto: UpdateCartitemDto,
  ) {
    return this.cartitemsService.update(+id, updateCartitemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartitemsService.remove(+id);
  }
}
