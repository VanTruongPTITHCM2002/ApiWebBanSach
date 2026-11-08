import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Book } from '../entities/book.entity';
import { FilterBookQueryDto } from '../dto/filter-book-query.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { CreateBookDto } from '../dto/create-book.dto';
import { BaseFilterDto } from '@/request/base-filter.dto';
import { BaseRepository } from '@/common/repositories/base.repository';
import { PageResult } from '@/common/interfaces/page-result.interface';
import { applyFilter, applySort } from '@/common/helpers/filter.helper';
import { paginateQuery } from '@/common/helpers/paginate.helper';

export interface CategoryBookFilters {
  page: number;
  size: number;
  sort?: string;
  publisherId?: string;
  minPrice?: string;
  maxPrice?: string;
}

@Injectable()
export class BooksRepository extends BaseRepository<Book> {
  constructor(@InjectRepository(Book) repo: Repository<Book>) {
    super(repo, 'book');
  }

  findByIdOrSku(idOrSku: string): Promise<Book | null> {
    return this.repo.findOne({
      where: [{ bookid: idOrSku }, { sku: idOrSku }],
      relations: ['authorId', 'publisher', 'category'],
    });
  }

  findByTitle(title: string): Promise<Book | null> {
    return this.repo.findOne({ where: { title } });
  }

  searchByTitle(title: string): Promise<Book[]> {
    return this.repo.find({
      where: { title: ILike(`%${title}%`) },
    });
  }

  findSuggestions(keyword: string, take = 5): Promise<Book[]> {
    return this.repo.find({
      where: { title: ILike(`%${keyword}%`) },
      take,
    });
  }

  findPageWithoutFilter(page: number, size: number): Promise<PageResult<Book>> {
    return this.findPage(page, size, {
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
      relations: ['authorId', 'category', 'publisher'],
    });
  }

  async findPageWithFilter(
    page: number,
    size: number,
    filters: FilterBookQueryDto,
  ): Promise<PageResult<Book>> {
    const where: FindOptionsWhere<Book> = { isDeleted: false };

    if (filters) {
      const status =
        filters.status !== undefined && filters.status !== ''
          ? filters.status === 'true' || filters.status === true
          : null;
      const minPrice = filters.minPrice ? Number(filters.minPrice) : null;
      const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;

      if (filters.title) {
        where.title = ILike(`%${filters.title}%`);
      }

      if (status !== null) {
        where.status = status;
      }

      if (filters.stock) {
        where.stock = Number(filters.stock);
      }

      if (minPrice !== null && maxPrice !== null) {
        where.price = Between(minPrice, maxPrice);
      } else if (minPrice !== null) {
        where.price = MoreThanOrEqual(minPrice);
      } else if (maxPrice !== null) {
        where.price = LessThanOrEqual(maxPrice);
      }

      if (filters.categoryId) {
        where.category = { categoryId: filters.categoryId };
      }

      if (filters.authorId) {
        where.authorId = { id: filters.authorId };
      }

      if (filters.publisherId) {
        where.publisher = { publisherId: filters.publisherId };
      }
    }

    return this.findPage(page, size, {
      where,
      relations: ['authorId', 'category', 'publisher'],
    });
  }

  findPageWithBaseFilter(
    queryParams: BaseFilterDto,
  ): Promise<Pagination<Book>> {
    const qb = this.query()
      .leftJoinAndSelect('book.authorId', 'author')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.publisher', 'publisher');

    applyFilter(qb, queryParams.filter, this.alias);
    applySort(qb, queryParams.filter?.sort ?? queryParams.sort);

    return paginateQuery(qb, queryParams.page, queryParams.size);
  }

  findBestSellers(): Promise<Book[]> {
    return this.query()
      .leftJoin('book.orderdetails', 'detail')
      .leftJoin('detail.orderId', 'order')
      .where('order.workflowStatus = :status', { status: 1 })
      .select(['book', 'COUNT(*) AS order_count'])
      .groupBy('book.bookid')
      .getMany();
  }

  findTopRated(): Promise<Book[]> {
    return this.query()
      .leftJoin('book.reviewBook', 'review')
      .andWhere('review.rating = :rating', { rating: 5 })
      .select(['book', 'COUNT(*) AS review_count'])
      .groupBy('book.bookid')
      .having('COUNT(*) > :minCount', { minCount: 5 })
      .getMany();
  }

  findDeleted(): Promise<Book[]> {
    return this.repo.find({ where: { isDeleted: true } });
  }

  countActiveBooks(): Promise<number> {
    return this.count({ isDeleted: false });
  }

  async markDeleted(id: string): Promise<boolean> {
    const book = await this.findByIdOrSku(id);
    if (!book) {
      return false;
    }

    book.isDeleted = true;
    await this.save(book);
    return true;
  }

  createBook(dto: CreateBookDto): Promise<Book> {
    return this.create({
      title: dto.title,
      price: dto.price,
      stock: dto.stock,
      thumbnail: dto.thumbnail,
      authorId: { id: dto.authorId },
      category: { categoryId: dto.categoryId },
      publisher: { publisherId: dto.publisherId },
      isDeleted: false,
      status: true,
      images: [...new Set(dto.images ?? [])],
    });
  }

  updateBook(id: string, dto: UpdateBookDto): Promise<void> {
    return this.updateById(id, {
      title: dto.title,
      authorId: { id: dto.authorId },
      category: { categoryId: dto.categoryId },
      publisher: { publisherId: dto.publisherId },
      price: dto.price,
      stock: dto.stock,
      images: [...new Set(dto.images ?? [])],
      thumbnail: dto.thumbnail,
    });
  }

  async findPageByCategory(
    categoryId: string,
    filters: CategoryBookFilters,
  ): Promise<PageResult<Book>> {
    const { page, size } = filters;
    let order: FindOptionsOrder<Book> = {};

    switch (filters.sort) {
      case 'new':
        order = { createdAt: 'DESC' };
        break;
      case 'min':
        order = { price: 'ASC' };
        break;
      case 'max':
        order = { price: 'DESC' };
        break;
    }

    const toNumberOrNull = (value?: string) =>
      value && value !== 'null' ? Number(value) : null;

    const min = toNumberOrNull(filters.minPrice);
    const max = toNumberOrNull(filters.maxPrice);

    let priceCondition: FindOptionsWhere<Book> = {};

    if (min !== null && max !== null) {
      priceCondition = { price: Between(min, max) };
    } else if (min !== null) {
      priceCondition = { price: MoreThanOrEqual(min) };
    } else if (max !== null) {
      priceCondition = { price: LessThanOrEqual(max) };
    }

    const where: FindOptionsWhere<Book> = {
      category: { categoryId },
      ...(filters.publisherId
        ? { publisher: { publisherId: filters.publisherId } }
        : {}),
      ...priceCondition,
    };

    const [content, totalElements] = await this.repo.findAndCount({
      skip: (page - 1) * size,
      take: size,
      where,
      relations: ['authorId'],
      order,
    });

    return this.toPage(content, totalElements, page, size);
  }

  countByCategory(categoryId: string): Promise<number> {
    return this.count({ category: { categoryId } });
  }

  private async findPage(
    page: number,
    size: number,
    options: {
      where: FindOptionsWhere<Book>;
      order?: FindOptionsOrder<Book>;
      relations?: string[];
    },
  ): Promise<PageResult<Book>> {
    const [content, totalElements] = await this.repo.findAndCount({
      skip: (page - 1) * size,
      take: size,
      ...options,
    });

    return this.toPage(content, totalElements, page, size);
  }
}
