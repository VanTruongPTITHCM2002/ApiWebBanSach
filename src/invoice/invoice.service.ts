import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PaymentMethod, PaymentStatus } from './entities/invoice.entity';
import { ApiRes } from '@/response/response.dto';
import { InvoicesRepository } from './repositories/invoices.repository';
import { UsersRepository } from '@/users/repositories/users.repository';
import { OrdersRepository } from '@/orders/repositories/orders.repository';
import { InvoiceMapper } from './mappers/invoice.mapper';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoicesRepository,
    private readonly userRepository: UsersRepository,
    private readonly orderRepository: OrdersRepository,
    private readonly invoiceMapper: InvoiceMapper,
  ) {}

  async create(dto: CreateInvoiceDto) {
    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const order = await this.orderRepository.findByIdOrCode(dto.orderId);

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    const subtotal = dto.items.reduce((sum, item) => sum + item.totalLine, 0);

    const vatAmount = dto.vatPercent
      ? (subtotal * dto.vatPercent) / 100
      : (dto.vatAmount ?? 0);

    const shippingFee = dto.shippingFee ?? 0;
    const discount = dto.discountAmount ?? 0;
    const totalAmount = subtotal + vatAmount + shippingFee - discount;

    const savedInvoice = await this.invoiceRepository.createWithItems({
      invoiceCode: dto.invoiceCode,
      userId: dto.userId,
      orderId: dto.orderId,
      issueDate: dto.issueDate ?? new Date(),
      subtotal,
      vatPercent: dto.vatPercent ?? 0,
      vatAmount,
      shippingFee,
      discountAmount: discount,
      totalAmount,
      paymentStatus: dto.paymentStatus ?? PaymentStatus.UNPAID,
      paymentMethod: dto.paymentMethod ?? PaymentMethod.COD,
      note: dto.note,
      items: dto.items.map((item) => ({
        bookId: item.bookId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount ?? 0,
        totalLine: item.totalLine,
      })),
    });

    return ApiRes.created('Tạo hóa đơn thành công', {
      invoiceId: savedInvoice.invoiceId,
      invoiceCode: savedInvoice.invoiceCode,
    });
  }

  async findAll(page: number, limit: number) {
    const result = await this.invoiceRepository.findPage(page, limit);
    return ApiRes.success('Get retrived all invoices', result);
  }

  async findOne(id: string) {
    const invoice = await this.invoiceRepository.findByIdOrCodeWithDetails(id);

    if (!invoice) {
      throw new NotFoundException(`Invoice ${id} not found`);
    }

    return ApiRes.success(
      'Get invoice successfully',
      this.invoiceMapper.toResponse(invoice),
    );
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    const invoice = await this.invoiceRepository.findByIdOrCode(id);

    if (!invoice) {
      throw new NotFoundException(`Invoice ${id} not found`);
    }

    await this.invoiceRepository.updatePaymentStatus(
      invoice.invoiceId,
      updateInvoiceDto.status as PaymentStatus,
    );

    return ApiRes.success('Cập nhật thành công hóa đơn');
  }

  remove(id: string) {
    return `This action removes a #${id} invoice`;
  }

  async getRevenueByInvoice() {
    const sum = await this.invoiceRepository.sumActiveTotalAmount();
    return ApiRes.success('Tổng doanh thu từ hóa đơn', sum);
  }
}
