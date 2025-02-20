import { Injectable } from '@nestjs/common';
import { CreateInvoiceitemDto } from './dto/create-invoiceitem.dto';
import { UpdateInvoiceitemDto } from './dto/update-invoiceitem.dto';

@Injectable()
export class InvoiceitemService {
  create(createInvoiceitemDto: CreateInvoiceitemDto) {
    return 'This action adds a new invoiceitem';
  }

  findAll() {
    return `This action returns all invoiceitem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invoiceitem`;
  }

  update(id: number, updateInvoiceitemDto: UpdateInvoiceitemDto) {
    return `This action updates a #${id} invoiceitem`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoiceitem`;
  }
}
