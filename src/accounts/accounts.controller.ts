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
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorators';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@Controller('accounts')
@ApiTags('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Tạo tài khoản thành công' })
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ description: 'Lấy danh sách tài khoản' })
  @ApiBearerAuth()
  @Roles('ADMIN')
  findAll(@Query('page') page: number = 1, @Query('size') size: number = 3) {
    return this.accountsService.findAll(page, size);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Lấy thông tin tài khoản' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID của tài khoản',
  })
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Cập nhật thông tin tài khoản' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID của tài khoản',
  })
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ description: 'Xóa tài khoản' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'username',
    type: 'string',
    description: 'Tên của tài khoản',
  })
  @Roles('ADMIN')
  remove(@Param('username') username: string) {
    return this.accountsService.remove(username);
  }
}
