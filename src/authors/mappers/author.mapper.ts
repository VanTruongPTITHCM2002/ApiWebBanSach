import { Injectable } from '@nestjs/common';
import { AuthorOptionResponse } from '../dto/author.response';
import { Author } from '../entities/author.entity';

@Injectable()
export class AuthorMapper {
  toOption(author: Author): AuthorOptionResponse {
    return {
      id: author.id,
      code: author.authorCode,
      name: `${author.firstname} ${author.lastname}`,
    };
  }
}
