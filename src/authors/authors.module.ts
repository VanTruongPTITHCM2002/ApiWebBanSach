import { Module } from '@nestjs/common';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { AuthorMapper } from './mappers/author.mapper';

@Module({
  controllers: [AuthorsController],
  providers: [AuthorsService, AuthorMapper],
})
export class AuthorsModule {}
