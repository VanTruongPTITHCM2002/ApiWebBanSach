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
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilterBookQueryDto } from './dto/filter-book-query.dto';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/role.guard';
import { Roles } from '@/common/decorators/role.decorators';
import { BaseFilterDto } from '@/request/base-filter.dto';
@Controller('/api/v1/books')
@ApiTags('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Tạo sách thành công!',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiProperty({
    type: CreateBookDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.booksService.create(createBookDto, file);
  }

  @Get()
  @ApiOkResponse({
    description: 'Lấy danh sách sách thành công',
  })
  findAll(
    @Query('page') page: string = '1',
    @Query('size') size: string = '5',
  ) {
    return this.booksService.findWithoutFilter(Number(page), Number(size));
  }

  @Get('/all')
  @ApiOkResponse({ description: 'Lấy danh sách sách thành công' })
  async findAllWithBase64(@Query() query: BaseFilterDto) {
    query.page = Number(query.page) || 1;
    query.size = Number(query.size) || 5;

    if (query.filter && typeof query.filter === 'string') {
      query.filter = JSON.parse(query.filter);
    }

    return this.booksService.findAllWithBase64(query);
  }

  @Get('/filter')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOkResponse({ description: 'Lấy danh sách có bộ lọc thành công' })
  @ApiBearerAuth()
  filterBook(
    @Query('page') page: string = '1',
    @Query('size') size: string = '5',
    @Query() query: FilterBookQueryDto,
  ) {
    const { page: _p, size: _s, ...filters } = query;
    console.log(_p, _s);
    return this.booksService.filter(Number(page), Number(size), filters);
  }

  @Get('/buys')
  getBookByBuy() {
    return this.booksService.getBookByBuy();
  }

  @Get('/reviews')
  getBookByReviews() {
    return this.booksService.getBooksByReviews();
  }

  @Get('/search-suggestions')
  getBookSearchSuggestions(@Query('name') name: string) {
    return this.booksService.getBookSearchSuggestions(name);
  }

  @Get('/name')
  getBookByBookName(@Query('bookName') bookName: string) {
    return this.booksService.getBookByName(bookName);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Tìm thành công sách cần tìm',
  })
  @ApiParam({ name: 'id', type: 'number' })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Get('/active')
  getActiveBooks() {
    return this.booksService.getActiveBooks();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Cập nhật thành công sách!',
  })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({
    type: UpdateBookDto,
  })
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
