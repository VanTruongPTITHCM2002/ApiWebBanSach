import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class BaseFilterDto {
  @IsOptional()
  filter?: any;
  @IsOptional()
  @IsArray()
  //   @IsString({ each: true })
  sort?: string[];
  @IsOptional()
  //   @IsInt()
  //   @Min(0)
  page?: number = 0;
  @IsOptional()
  //   @IsInt()
  //   @Min(1)
  size?: number = 5;
}
