import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { BaseRepository } from '@/common/repositories/base.repository';
import { PageResult } from '@/common/interfaces/page-result.interface';

@Injectable()
export class CategoriesRepository extends BaseRepository<Category> {
  constructor(@InjectRepository(Category) repo: Repository<Category>) {
    super(repo, 'category');
  }

  findByName(categoryName: string): Promise<Category | null> {
    return this.repo.findOne({ where: { categoryName } });
  }

  findByIdOrCode(idOrCode: string): Promise<Category | null> {
    return this.repo.findOne({
      where: [{ categoryId: idOrCode }, { categoryCode: idOrCode }],
    });
  }

  findActive(): Promise<Category[]> {
    return this.repo.find({ where: { isActive: true } });
  }

  async findPageWithBookCount(
    page: number,
    size: number,
    search?: string,
  ): Promise<PageResult<Category & { bookCount?: number }>> {
    const qb = this.query().loadRelationCountAndMap(
      'category.bookCount',
      'category.books',
    );

    if (search && search !== 'undefined' && search !== 'null') {
      qb.where('category.categoryName LIKE :search', {
        search: `%${search}%`,
      });
    }

    const totalElements = await qb.clone().getCount();
    const content = await qb
      .skip((page - 1) * size)
      .take(size)
      .getMany();

    return this.toPage(content, totalElements, page, size);
  }
}
