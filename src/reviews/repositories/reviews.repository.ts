import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { BaseRepository } from '@/common/repositories/base.repository';

@Injectable()
export class ReviewsRepository extends BaseRepository<Review> {
  constructor(@InjectRepository(Review) repo: Repository<Review>) {
    super(repo, 'review');
  }

  findByIdOrCode(idOrCode: string): Promise<Review | null> {
    return this.repo.findOne({
      where: [{ reviewId: idOrCode }, { reviewCode: idOrCode }],
    });
  }
}
