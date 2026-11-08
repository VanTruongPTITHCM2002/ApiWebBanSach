import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orderdetail } from '../entities/orderdetail.entity';
import { BaseRepository } from '@/common/repositories/base.repository';

export interface TopBookItem {
  bookId: string;
  sku: string;
  title: string;
  totalSold: string | number;
}

@Injectable()
export class OrderDetailsRepository extends BaseRepository<Orderdetail> {
  constructor(@InjectRepository(Orderdetail) repo: Repository<Orderdetail>) {
    super(repo, 'orderdetail');
  }

  findByOrder(orderId: string): Promise<Orderdetail[]> {
    return this.repo.find({
      where: [{ orderId: { orderId } }, { orderId: { orderCode: orderId } }],
    });
  }

  findByOrderAndBook(
    orderId: string,
    bookId: string,
  ): Promise<Orderdetail | null> {
    return this.repo.findOne({
      where: [
        { orderId: { orderId }, books: { bookid: bookId } },
        { orderId: { orderCode: orderId }, books: { bookid: bookId } },
      ],
    });
  }

  updateQuantity(orderdetailId: string, quantity: number): Promise<void> {
    return this.updateById(orderdetailId, { quantity });
  }

  topFiveBooks(): Promise<TopBookItem[]> {
    return this.query()
      .innerJoin('orderdetail.orderId', 'order')
      .innerJoin('orderdetail.books', 'book')
      .select('book.bookid', 'bookId')
      .addSelect('book.sku', 'sku')
      .addSelect('book.title', 'title')
      .addSelect('SUM(orderdetail.quantity)', 'totalSold')
      .where('order.workflowStatus = :workflowStatus', { workflowStatus: 1 })
      .andWhere('MONTH(order.createdAt) = MONTH(CURRENT_DATE())')
      .andWhere('YEAR(order.createdAt) = YEAR(CURRENT_DATE())')
      .groupBy('book.bookid')
      .orderBy('totalSold', 'DESC')
      .limit(5)
      .getRawMany<TopBookItem>();
  }
}
