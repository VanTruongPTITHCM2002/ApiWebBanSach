import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { ApiRes } from '@/response/response.dto';
import { filterPublisherQueryDto } from './dto/filter-publisher-query-dto';
import { PublishersRepository } from './repositories/publishers.repository';
import { PublisherMapper } from './mappers/publisher.mapper';

@Injectable()
export class PublishersService {
  constructor(
    private readonly publisherRepository: PublishersRepository,
    private readonly publisherMapper: PublisherMapper,
  ) {}

  async create(createPublisherDto: CreatePublisherDto) {
    const publisher = await this.publisherRepository.findByName(
      createPublisherDto.publisherName,
    );

    if (publisher) {
      throw new BadRequestException('Nhà xuất bản đã tồn tại');
    }

    await this.publisherRepository.create(createPublisherDto);
    return ApiRes.created('Thêm nhà xuất bản thành công');
  }

  async findAll(page: number, size: number, filters: filterPublisherQueryDto) {
    const result = await this.publisherRepository.findPage(page, size, filters);
    return ApiRes.success('Hiện danh sách nhà xuất bản thành công', result);
  }

  async findOne(id: string) {
    const publisher = await this.publisherRepository.findByIdOrCode(id);

    if (!publisher) {
      throw new NotFoundException('Không tìm thấy nhà xuất bản');
    }

    return ApiRes.success('Tìm thành công nhà xuất bản', publisher);
  }

  async findNotPaginate() {
    const publishers = await this.publisherRepository.findMany();

    const publishersResponse = publishers.map((publisher) =>
      this.publisherMapper.toSelectResponse(publisher),
    );

    return ApiRes.success('Get publishers successfully', publishersResponse);
  }

  async update(id: string, updatePublisherDto: UpdatePublisherDto) {
    await this.publisherRepository.updateById(id, updatePublisherDto);
    return ApiRes.success('Cập nhật thành công nhà xuất bản');
  }

  async remove(id: string) {
    const publisher =
      await this.publisherRepository.findByIdOrCodeWithBooks(id);

    if (!publisher) {
      throw new NotFoundException('Không tìm thấy nhà xuất bản');
    }

    if (publisher.books?.length > 0) {
      throw new BadRequestException('Không thể xóa nhà xuất bản');
    }

    await this.publisherRepository.deleteById(id);
    return ApiRes.success('Xóa thành công nhà xuất bản');
  }
}
