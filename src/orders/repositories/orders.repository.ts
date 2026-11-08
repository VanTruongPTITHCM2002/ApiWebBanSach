import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Orderdetail } from '@/orderdetail/entities/orderdetail.entity';
import { Cart } from '@/carts/entities/cart.entity';
import { Cartitem } from '@/cartitems/entities/cartitem.entity';
import { Account } from '@/accounts/entities/account.entity';
import { User } from '@/users/entities/user.entity';
import { BaseRepository } from '@/common/repositories/base.repository';
import { PageResult } from '@/common/interfaces/page-result.interface';

export interface OrderListItem {
  orderId: string;
  orderCode: string;
  totalAmount: number;
  orderDate: Date;
  status: number;
  methodPay: string;
  customerName: string;
  phone: string;
  address: string;
  username: string;
  fullName: string;
}

export interface RevenueRow {
  order_date: string;
  total_revenue: string | number;
}

export interface CheckoutInput {
  username: string;
  cartId: string;
  methodPay?: string;
  customerName?: string;
  phone?: string;
  address?: string;
}

export type CheckoutFailureReason =
  | 'ACCOUNT_NOT_FOUND'
  | 'USER_NOT_FOUND'
  | 'CART_NOT_FOUND'
  | 'CART_EMPTY';

export type CheckoutResult =
  | { ok: true; order: Order; totalAmount: number }
  | { ok: false; reason: CheckoutFailureReason };

@Injectable()
export class OrdersRepository extends BaseRepository<Order> {
  constructor(@InjectRepository(Order) repo: Repository<Order>) {
    super(repo, 'order');
  }

  findByIdOrCode(id: string): Promise<Order | null> {
    return this.repo.findOne({
      where: [{ orderId: id }, { orderCode: id }],
    });
  }

  findByIdOrCodeWithDetails(id: string): Promise<Order | null> {
    return this.repo.findOne({
      where: [{ orderId: id }, { orderCode: id }],
      relations: ['orderdetails', 'orderdetails.books'],
    });
  }

  async findPage(
    page: number,
    size: number,
  ): Promise<PageResult<OrderListItem>> {
    const qb = this.listQuery();
    const totalElements = await qb.getCount();
    const content = await qb
      .orderBy('order.orderDate', 'DESC')
      .skip((page - 1) * size)
      .take(size)
      .getRawMany<OrderListItem>();

    return this.toPage(content, totalElements, page, size);
  }

  async findPageByUsername(
    username: string,
    page: number,
    size: number,
  ): Promise<PageResult<OrderListItem>> {
    const qb = this.listQuery()
      .where('account.username = :username', { username })
      .andWhere('order.isActive = :isActive', { isActive: true });

    const totalElements = await qb.getCount();
    const content = await qb
      .orderBy('order.orderDate', 'DESC')
      .skip((page - 1) * size)
      .take(size)
      .getRawMany<OrderListItem>();

    return this.toPage(content, totalElements, page, size);
  }

  findByDate(date: string): Promise<Order[]> {
    return this.query()
      .where('DATE(order.orderDate) = :date', { date })
      .getMany();
  }

  countCompleted(): Promise<number> {
    return this.count({ isActive: true, workflowStatus: 1 });
  }

  updateStatus(id: string, status: number): Promise<void> {
    return this.updateById(id, { workflowStatus: status });
  }

  cancel(id: string): Promise<void> {
    return this.updateById(id, { workflowStatus: -1 });
  }

  revenueSince(startDate: Date): Promise<RevenueRow[]> {
    return this.query()
      .leftJoin('order.orderdetails', 'detail')
      .select('DATE(order.orderDate)', 'order_date')
      .addSelect('SUM(detail.price * detail.quantity)', 'total_revenue')
      .where('order.orderDate >= :startDate', { startDate })
      .andWhere('order.workflowStatus = :workflowStatus', { workflowStatus: 1 })
      .groupBy('DATE(order.orderDate)')
      .orderBy('order_date', 'ASC')
      .getRawMany<RevenueRow>();
  }

  async createFromCart(input: CheckoutInput): Promise<CheckoutResult> {
    const account = await this.repo.manager.getRepository(Account).findOne({
      where: { username: input.username },
    });

    if (!account) {
      return { ok: false, reason: 'ACCOUNT_NOT_FOUND' };
    }

    const user = await this.repo.manager.getRepository(User).findOne({
      where: { accountFK: { accountId: account.accountId } },
    });

    if (!user) {
      return { ok: false, reason: 'USER_NOT_FOUND' };
    }

    return this.repo.manager.transaction(async (manager) => {
      const cartRepo = manager.getRepository(Cart);
      const cartItemRepo = manager.getRepository(Cartitem);
      const orderRepo = manager.getRepository(Order);
      const detailRepo = manager.getRepository(Orderdetail);

      const cart = await cartRepo.findOne({
        where: { cartId: input.cartId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!cart) {
        return { ok: false, reason: 'CART_NOT_FOUND' };
      }

      const cartItems = await cartItemRepo.find({
        where: { carts: { cartId: cart.cartId } },
        relations: ['bookId'],
      });

      if (!cartItems.length) {
        return { ok: false, reason: 'CART_EMPTY' };
      }

      const totalAmount = cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0,
      );

      const order = await orderRepo.save(
        orderRepo.create({
          userId: user,
          orderDate: new Date(),
          workflowStatus: 0,
          totalAmount,
          methodPay: input.methodPay ?? 'COD',
          customerName: input.customerName,
          phone: input.phone,
          address: input.address,
          isActive: true,
        }),
      );

      await detailRepo.save(
        detailRepo.create(
          cartItems.map((item) => ({
            orderId: order,
            books: item.bookId,
            price: item.price,
            quantity: item.quantity,
          })),
        ),
      );

      cart.isActive = false;
      await cartRepo.save(cart);

      return { ok: true, order, totalAmount };
    });
  }

  private listQuery() {
    return this.query()
      .leftJoin('order.userId', 'user')
      .leftJoin('user.accountFK', 'account')
      .select([
        'order.orderId as orderId',
        'order.orderCode as orderCode',
        'order.totalAmount as totalAmount',
        'order.orderDate as orderDate',
        'order.workflowStatus as status',
        'order.methodPay as methodPay',
        'order.customerName as customerName',
        'order.phone as phone',
        'order.address as address',
        'account.username as username',
      ])
      .addSelect("CONCAT(user.firstname, ' ', user.lastname)", 'fullName');
  }
}
