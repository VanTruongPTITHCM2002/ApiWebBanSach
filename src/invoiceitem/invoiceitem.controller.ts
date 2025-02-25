import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InvoiceitemService } from './invoiceitem.service';
import { CreateInvoiceitemDto } from './dto/create-invoiceitem.dto';
import { UpdateInvoiceitemDto } from './dto/update-invoiceitem.dto';

@Controller('invoiceitem')
export class InvoiceitemController {
  constructor(private readonly invoiceitemService: InvoiceitemService) {}

  @Post()
  create(@Body() createInvoiceitemDto: CreateInvoiceitemDto) {
    return this.invoiceitemService.create(createInvoiceitemDto);
  }

  @Get()
  findAll() {
    return this.invoiceitemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceitemService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInvoiceitemDto: UpdateInvoiceitemDto,
  ) {
    return this.invoiceitemService.update(+id, updateInvoiceitemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoiceitemService.remove(+id);
  }
}
