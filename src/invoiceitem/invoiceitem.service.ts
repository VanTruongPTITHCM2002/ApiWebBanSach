import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceItemDto } from './dto/create-invoiceitem.dto';
import { UpdateInvoiceItemDto } from './dto/update-invoiceitem.dto';
import { ApiRes } from '@/response/response.dto';
import { InvoiceItemsRepository } from './repositories/invoiceitems.repository';
import { InvoicesRepository } from '@/invoice/repositories/invoices.repository';

@Injectable()
export class InvoiceitemService {
  constructor(
    private readonly invoiceItemRepository: InvoiceItemsRepository,
    private readonly invoiceRepository: InvoicesRepository,
  ) {}

  create(_createInvoiceitemDto: CreateInvoiceItemDto) {
    return ApiRes.created('Tạo hóa đơn thành công');
  }

  findAll() {
    return `This action returns all invoiceitem`;
  }

  async findOne(id: string) {
    const invoice = await this.invoiceRepository.findByIdOrCode(id);

    if (!invoice) {
      throw new NotFoundException('Không tìm thấy hóa đơn này');
    }

    const invoiceItems = await this.invoiceItemRepository.findByInvoice(
      invoice.invoiceId,
    );

    return ApiRes.success('Lấy danh sách hóa đơn thành công', invoiceItems);
  }

  update(id: number, _updateInvoiceitemDto: UpdateInvoiceItemDto) {
    return `This action updates a #${id} invoiceitem`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoiceitem`;
  }
}
