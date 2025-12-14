import { Injectable, Logger } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Review } from './entities/review.entity';
import { Book } from '@/books/entities/book.entity';
import { Account } from '@/accounts/entities/account.entity';
import { ApiRes } from '@/response/response.dto';

@Injectable()
export class ReviewsService {
  private log: Logger = new Logger(ReviewsService.name);
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    try {
      const [book, account] = await Promise.all([
        this.bookRepository.findOne({
          where: { title: createReviewDto.bookName },
        }),
        this.accountRepository.findOne({
          where: { username: createReviewDto.username },
        }),
      ]);

      if (!book) {
        this.log.error('Không tìm thấy sách');
        return ApiRes.notFound('Không tìm thấy sách', 'Thất bại');
      }

      if (!account) {
        this.log.error('Không tìm thấy tài khoản');
        return ApiRes.notFound('Không tìm thấy tài khoản', 'Thất bại');
      }

      const review = await this.reviewRepository.create({
        accountName: account,
        books: book,
        rating: createReviewDto.rating,
        reviewDate: createReviewDto.reviewDate,
        comment: createReviewDto.comment,
      });
      await this.reviewRepository.save(review);
      this.log.log('Thêm đánh giá thành công');
      return ApiRes.created('Thêm đánh giá thành công', '');
    } catch (error: any) {
      this.log.error('Thêm sách thất bại');
      console.log(error.message);
      return ApiRes.error('Có lỗi xảy ra', 'Thất bại');
    }
  }

  async findAll() {
    try {
      const reviews = await this.reviewRepository.find();
      this.log.log('Lấy danh sách đánh giá thành công');
      return ApiRes.success('Lấy danh sách đánh giá thành công', reviews);
    } catch (error: any) {
      this.log.log('Lấy danh sách đánh giá thất bại');
      return ApiRes.error('Lấy danh sách đánh giá thất bại', 'Thất bại');
    }
  }

  async findOne(id: number) {
    try {
      const review = await this.reviewRepository.findOne({
        where: { reviewId: id },
      });
      if (!review) {
        this.log.error('Không tìm thấy đánh giá này');
        return ApiRes.notFound('Không tìm thấy đánh giá này', 'Thất bại');
      }

      this.log.log('Tìm thấy đánh giá');
      return ApiRes.success('Tìm thấy đánh giá', review);
    } catch (error: any) {
      this.log.error('Không thể tìm đánh giá');
      return ApiRes.error('Không thể tìm đánh giá', 'Thất bại');
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    try {
      const review = await this.reviewRepository.findOne({
        where: { reviewId: id },
      });
      if (!review) {
        this.log.error('Không tìm thấy đánh giá này');
        return ApiRes.notFound('Không tìm thấy đánh giá này', 'Thất bại');
      }
      await this.reviewRepository.update(id, updateReviewDto);
      this.log.log('Cập nhật đánh giá thành công');
      return ApiRes.success('Cập nhật đánh giá thành công', '');
    } catch (error: any) {
      this.log.error('Cập nhật đánh giá thất bại');
      return ApiRes.error('Cập nhật đánh giá thất bại', 'Thất bại');
    }
  }

  async remove(id: number) {
    try {
      const review = await this.reviewRepository.findOne({
        where: { reviewId: id },
      });
      if (!review) {
        this.log.error('Không tìm thấy đánh giá này');
        return ApiRes.notFound('Không tìm thấy đánh giá này', 'Thất bại');
      }
      await this.reviewRepository.delete(id);
      this.log.log('Xóa thành công đánh giá');
      return ApiRes.success('Xóa thành công đánh giá', '');
    } catch (error: any) {
      this.log.error('Xóa đánh giá thất bại');
      console.log(error.message);
      return ApiRes.error('Xóa đánh giá thất bại', 'Thất bại');
    }
  }
}
