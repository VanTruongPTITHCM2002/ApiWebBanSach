import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Book } from '@/books/entities/book.entity';
import { Account } from '@/accounts/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Account, Book])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
