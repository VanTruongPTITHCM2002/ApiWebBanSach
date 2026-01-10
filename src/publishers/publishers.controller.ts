import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '@/common/guards/role.guard';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { Roles } from '@/common/decorators/role.decorators';
import { filterPublisherQueryDto } from './dto/filter-publisher-query-dto';

@Controller('/api/v1/publishers')
@ApiTags('/api/v1/publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() createPublisherDto: CreatePublisherDto) {
    return this.publishersService.create(createPublisherDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll(
    @Query('page') page: number = 1,
    @Query('size') size: number = 5,
    @Query() query: filterPublisherQueryDto,
  ) {
    const { page: _p, size: _s, ...filters } = query;
    console.log(_p, _s);
    return this.publishersService.findAll(page, size, filters);
  }

  @Get('/list')
  findAllNotPaginate() {
    return this.publishersService.findNotPaginate();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publishersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() updatePublisherDto: UpdatePublisherDto,
  ) {
    return this.publishersService.update(+id, updatePublisherDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.publishersService.remove(+id);
  }
}
