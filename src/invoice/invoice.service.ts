import { ApiResponse } from './../response/apires';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { User } from 'src/users/entities/user.entity';
import { Builder } from 'builder-pattern';
import { convertStatusToNumber } from 'src/utils/convertStringtoNumber';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createInvoiceDto: CreateInvoiceDto) {
    try {
      const user: User = await this.userRepository
        .createQueryBuilder('user')
        .where('user.accountId.username = :username', {
          username: createInvoiceDto.username,
        })
        .execute();
      if (user === null) {
        return Builder<ApiResponse<any>>()
          .statusCode(HttpStatus.BAD_REQUEST)
          .message('Không tìm thấy tài khoản')
          .build();
      }
      const invoice: Invoice = new Invoice();
      invoice.userId = user;
      invoice.invoiceDate = new Date(createInvoiceDto.invoiceDate);
      invoice.paymentMethod = createInvoiceDto.paymentMethod;

      await this.invoiceRepository.save(invoice);
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.CREATED)
        .message('Thêm hóa đơn thành công')
        .build();
    } catch (err: any) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Xảy ra lỗi trong cơ sở dữ liệu')
        .build();
    }
  }

  async findAll() {
    try {
      const invoices = await this.invoiceRepository.find();
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Danh sách tất cả hóa đơn bán sách')
        .data(invoices)
        .build();
    } catch (err: any) {}
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
      .message('Xảy ra lỗi trong cơ sở dữ liệu')
      .build();
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    try {
      const invoice: Invoice = await this.invoiceRepository.findOne({
        where: { invoiceId: id },
      });

      invoice.invoiceDate = new Date(updateInvoiceDto.invoiceDate);
      invoice.paymentMethod = updateInvoiceDto.paymentMethod;
      invoice.status = convertStatusToNumber(updateInvoiceDto.status);

      await this.invoiceRepository.update(id, invoice);

      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Cập nhật thành công hóa đơn')
        .build();
    } catch (err: any) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Xảy ra lỗi trong cơ sở dữ liệu')
        .build();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
