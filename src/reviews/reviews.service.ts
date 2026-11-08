import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiRes } from '@/response/response.dto';
import { ReviewsRepository } from './repositories/reviews.repository';
import { BooksRepository } from '@/books/repositories/books.repository';
import { AccountsRepository } from '@/accounts/repositories/accounts.repository';

@Injectable()
export class ReviewsService {
  private log: Logger = new Logger(ReviewsService.name);
  constructor(
    private readonly reviewRepository: ReviewsRepository,
    private readonly bookRepository: BooksRepository,
    private readonly accountRepository: AccountsRepository,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const [book, account] = await Promise.all([
      this.bookRepository.findByTitle(createReviewDto.bookName),
      this.accountRepository.findByUsername(createReviewDto.username),
    ]);

    if (!book) {
      this.log.error('Không tìm thấy sách');
      throw new NotFoundException('Không tìm thấy sách');
    }

    if (!account) {
      this.log.error('Không tìm thấy tài khoản');
      throw new NotFoundException('Không tìm thấy tài khoản');
    }

    await this.reviewRepository.create({
      accountName: account,
      books: book,
      rating: createReviewDto.rating,
      reviewDate: createReviewDto.reviewDate,
      comment: createReviewDto.comment,
    });

    this.log.log('Thêm đánh giá thành công');
    return ApiRes.created('Thêm đánh giá thành công', '');
  }

  async findAll() {
    const reviews = await this.reviewRepository.findMany();
    this.log.log('Lấy danh sách đánh giá thành công');
    return ApiRes.success('Lấy danh sách đánh giá thành công', reviews);
  }

  async findOne(id: string) {
    const review = await this.reviewRepository.findByIdOrCode(id);

    if (!review) {
      this.log.error('Không tìm thấy đánh giá này');
      throw new NotFoundException('Không tìm thấy đánh giá này');
    }

    this.log.log('Tìm thấy đánh giá');
    return ApiRes.success('Tìm thấy đánh giá', review);
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewRepository.findByIdOrCode(id);

    if (!review) {
      this.log.error('Không tìm thấy đánh giá này');
      throw new NotFoundException('Không tìm thấy đánh giá này');
    }

    await this.reviewRepository.updateById(review.reviewId, updateReviewDto);
    this.log.log('Cập nhật đánh giá thành công');
    return ApiRes.success('Cập nhật đánh giá thành công', '');
  }

  async remove(id: string) {
    const review = await this.reviewRepository.findByIdOrCode(id);

    if (!review) {
      this.log.error('Không tìm thấy đánh giá này');
      throw new NotFoundException('Không tìm thấy đánh giá này');
    }

    await this.reviewRepository.deleteById(review.reviewId);
    this.log.log('Xóa thành công đánh giá');
    return ApiRes.success('Xóa thành công đánh giá', '');
  }
}
