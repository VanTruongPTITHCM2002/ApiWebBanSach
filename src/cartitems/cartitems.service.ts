import { Injectable } from '@nestjs/common';
import { CreateCartitemDto } from './dto/create-cartitem.dto';
import { UpdateCartitemDto } from './dto/update-cartitem.dto';

@Injectable()
export class CartitemsService {
  create(createCartitemDto: CreateCartitemDto) {
    return 'This action adds a new cartitem';
  }

  findAll() {
    return `This action returns all cartitems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cartitem`;
  }

  update(id: number, updateCartitemDto: UpdateCartitemDto) {
    return `This action updates a #${id} cartitem`;
  }

  remove(id: number) {
    return `This action removes a #${id} cartitem`;
  }
}
