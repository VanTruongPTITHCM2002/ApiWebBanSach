import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, PaymentStatus } from './entities/invoice.entity';
import { User } from '@/users/entities/user.entity';
import { InvoiceItem } from '@/invoiceitem/entities/invoiceitem.entity';
import { Order } from '@/orders/entities/order.entity';
import { ApiRes } from '@/response/response.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(InvoiceItem)
    private readonly invoideItemRepository: Repository<InvoiceItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  async create(dto: CreateInvoiceDto) {
    try {
      const user = this.userRepository.findOne({
        where: { usersId: dto.userId },
      });

      if (!user) return ApiRes.notFound('Người dùng không tồn tại');

      const order = this.orderRepository.findOne({
        where: { orderId: dto.orderId },
      });

      if (!order) return ApiRes.notFound('Không tìm thấy đơn hàng');

      const subtotal = dto.items.reduce((sum, item) => sum + item.totalLine, 0);

      const vatAmount = dto.vatPercent
        ? (subtotal * dto.vatPercent) / 100
        : (dto.vatAmount ?? 0);

      const shippingFee = dto.shippingFee ?? 0;
      const discount = dto.discountAmount ?? 0;
      const totalAmount = subtotal + vatAmount + shippingFee - discount;

      // 2️⃣ Khởi tạo entity Invoice
      const invoice = this.invoiceRepository.create({
        invoiceCode: dto.invoiceCode ?? `HD${Date.now()}`,
        order: await order,
        userId: await user,
        issueDate: dto.issueDate ?? new Date(),
        subtotal,
        vatPercent: dto.vatPercent ?? 0,
        vatAmount,
        shippingFee,
        discountAmount: discount,
        totalAmount,
        paymentStatus: dto.paymentStatus ?? PaymentStatus.UNPAID,
        paymentMethod: dto.paymentMethod,
        note: dto.note,
      });

      // 3️⃣ Lưu invoice
      const savedInvoice = await this.invoiceRepository.save(invoice);

      // 4️⃣ Tạo items và gắn vào invoice
      const items = dto.items.map((i) =>
        this.invoideItemRepository.create({
          invoice: savedInvoice,
          book: { id: i.bookId } as any,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          discount: i.discount ?? 0,
          totalLine: i.totalLine,
        }),
      );
      await this.invoideItemRepository.save(items);

      return ApiRes.created('Tạo hóa đơn thành công');
    } catch (err: any) {
      console.error(err);
      return ApiRes.internalServerError(
        'Có lỗi xảy ra trong quá trình tạo hóa đơn',
      );
    }
  }

  async findAll(page: number, limit: number) {
    try {
      const invoices = await this.invoiceRepository.find({
        // relations: ['invoiceItems'],
        // order: { issueDate: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
      return ApiRes.success('Get retrived all invoices', invoices);
    } catch (error) {
      console.error(error);
      return ApiRes.internalServerError(
        'Có lỗi xảy ra trong quá trình lấy danh sách hóa đơn',
      );
    }
  }

  async findOne(id: number) {
    try {
      const invoice = await this.invoiceRepository.findOne({
        where: { invoiceId: id },
        relations: [
          'userId',
          'order',
          'invoiceItems',
          'invoiceItems.book',
          'userId.accountFK',
        ],
      });

      if (!invoice) ApiRes.notFound(`Invoice ${id} not found`);

      return ApiRes.success('Get invoice successfully', {
        invoiceId: invoice.invoiceId,
        invoiceCode: invoice.invoiceCode,
        issueDate: invoice.issueDate,
        totalAmount: invoice.totalAmount,
        paymentStatus: invoice.paymentStatus,
        paymentMethod: invoice.paymentMethod,
        note: invoice.note,
        username: invoice.userId.accountFK.username,
        fullName: `${invoice.userId.firstname} ${invoice.userId.lastname}`,
        orderId: invoice.order.orderId,
        items: invoice.invoiceItems.map((it) => ({
          invoiceitemId: it.invoiceitemId,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          totalLine: it.totalLine,
          bookid: it.book.bookid,
          title: it.book.title,
          image: it.book.link,
        })),
      });
    } catch (error) {
      console.error(error);
      return ApiRes.internalServerError(
        'Có lỗi xảy ra trong quá trình lấy thông tin hóa dơn',
      );
    }
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    try {
      const invoice: Invoice = await this.invoiceRepository.findOne({
        where: { invoiceId: id },
      });
      invoice.paymentStatus = updateInvoiceDto.status as PaymentStatus;
      await this.invoiceRepository.update(id, invoice);

      return ApiRes.success('Cập nhật thành công hóa đơn');
    } catch (err: any) {
      return ApiRes.internalServerError(
        'Có lỗi xảy ra trong quá trình cập nhật hóa đơn',
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
