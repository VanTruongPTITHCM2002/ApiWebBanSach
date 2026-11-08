import { Injectable } from '@nestjs/common';
import { PublisherSelectResponse } from '../dto/publisher.response';
import { Publisher } from '../entities/publisher.entity';

@Injectable()
export class PublisherMapper {
  toSelectResponse(publisher: Publisher): PublisherSelectResponse {
    return {
      name: publisher.publisherName,
      publisherId: publisher.publisherId,
      publisherCode: publisher.publisherCode,
    };
  }
}
