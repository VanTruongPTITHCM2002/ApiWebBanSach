import { Module } from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { PublishersController } from './publishers.controller';
import { PublisherMapper } from './mappers/publisher.mapper';

@Module({
  controllers: [PublishersController],
  providers: [PublishersService, PublisherMapper],
})
export class PublishersModule {}
