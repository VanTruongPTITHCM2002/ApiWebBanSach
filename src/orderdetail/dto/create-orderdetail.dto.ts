import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderdetailDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  cartId: string;
  @IsOptional()
  @IsIn(['COD', 'BANKING'])
  methodPay?: string;
  @IsOptional()
  @IsString()
  customerName?: string;
  @IsOptional()
  @IsString()
  phone?: string;
  @IsOptional()
  @IsString()
  address?: string;
}
