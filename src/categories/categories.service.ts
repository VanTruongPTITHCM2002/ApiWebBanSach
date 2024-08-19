/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { Builder } from 'builder-pattern';
import { ApiResponse } from 'src/response/apires';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      await this.categoryRepository.save(createCategoryDto);
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể thêm danh mục')
        .data('')
        .build();
    }
    // return this.categoryRepository.save(createCategoryDto);

    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.CREATED)
      .message('Thêm danh mục thành công')
      .data('')
      .build();
  }

  async findAll() {
    let categories = [];
    try {
      categories = await this.categoryRepository.find();
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Lỗi khi lấy danh sách danh mục')
        .data(categories)
        .build();
    }
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.OK)
      .message('Danh sách danh mục của sách')
      .data(categories)
      .build();
  }

  async findOne(id: number) {
    let category: Category = {
      categoryId: 0, // Giá trị mặc định, cần thay đổi nếu `Category` có các trường khác
      categoryName: '', // Giá trị mặc định
    };
    try {
      category = await this.categoryRepository.findOne({
        where: { categoryId: id },
      });

      if (!category) {
        return Builder<ApiResponse<any>>()
          .statusCode(HttpStatus.NOT_FOUND)
          .message('Không tìm thấy danh mục')
          .data('')
          .build();
      }
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể lấy được danh mục')
        .data('')
        .build();
    }
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.OK)
      .message('Tìm thấy danh mục thành công')
      .data(category)
      .build();
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.categoryRepository.update(id, updateCategoryDto);
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể cập nhật danh mục')
        .data('')
        .build();
    }

    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.OK)
      .message('Cập nhật danh mục thành công')
      .data('')
      .build();
  }

  async remove(id: number) {
    try {
      await this.categoryRepository.delete(id);
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể xóa danh mục này')
        .data('')
        .build();
    }

    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.OK)
      .message('Xóa thành công')
      .data('')
      .build();
  }
}
