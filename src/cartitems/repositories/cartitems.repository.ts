import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cartitem } from '../entities/cartitem.entity';
import { Book } from '@/books/entities/book.entity';
import { BaseRepository } from '@/common/repositories/base.repository';

export type CartItemFailure = 'BOOK_NOT_FOUND' | 'INSUFFICIENT_STOCK';

export type CartItemWriteResult =
  | { ok: true; item: Cartitem; created: boolean }
  | { ok: false; reason: CartItemFailure };

@Injectable()
export class CartItemsRepository extends BaseRepository<Cartitem> {
  constructor(@InjectRepository(Cartitem) repo: Repository<Cartitem>) {
    super(repo, 'cartitem');
  }

  findByCart(cartId: string): Promise<Cartitem[]> {
    return this.repo.find({
      where: { carts: { cartId } },
      relations: ['bookId'],
    });
  }

  findByCartAndBook(cartId: string, bookId: string): Promise<Cartitem | null> {
    return this.repo.findOne({
      where: { carts: { cartId }, bookId: { bookid: bookId } },
    });
  }

  add(
    cartId: string,
    bookId: string,
    quantity: number,
  ): Promise<CartItemWriteResult> {
    return this.write(cartId, bookId, quantity, 'add');
  }

  setQuantity(
    cartId: string,
    bookId: string,
    quantity: number,
    cartItemId?: string,
  ): Promise<CartItemWriteResult> {
    return this.write(cartId, bookId, quantity, 'set', cartItemId);
  }

  private write(
    cartId: string,
    bookId: string,
    quantity: number,
    mode: 'add' | 'set',
    cartItemId?: string,
  ): Promise<CartItemWriteResult> {
    return this.repo.manager.transaction(async (manager) => {
      const bookRepo = manager.getRepository(Book);
      const itemRepo = manager.getRepository(Cartitem);

      const book = await bookRepo.findOne({
        where: { bookid: bookId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!book) {
        return { ok: false, reason: 'BOOK_NOT_FOUND' };
      }

      const existing = cartItemId
        ? await itemRepo.findOne({
            where: { cartitemId: cartItemId },
            lock: { mode: 'pessimistic_write' },
          })
        : await itemRepo.findOne({
            where: { carts: { cartId }, bookId: { bookid: bookId } },
            lock: { mode: 'pessimistic_write' },
          });

      const nextQuantity = existing
        ? mode === 'add'
          ? existing.quantity + quantity
          : quantity
        : quantity;
      const delta = existing ? nextQuantity - existing.quantity : nextQuantity;

      if (delta > 0 && book.stock < delta) {
        return { ok: false, reason: 'INSUFFICIENT_STOCK' };
      }

      const item = existing
        ? await itemRepo.save(
            Object.assign(existing, { quantity: nextQuantity }),
          )
        : await itemRepo.save(
            itemRepo.create({
              carts: { cartId },
              bookId: book,
              price: book.price,
              quantity: nextQuantity,
            }),
          );

      book.stock -= delta;
      await bookRepo.save(book);

      return { ok: true, item, created: !existing };
    });
  }
}
