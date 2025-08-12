import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @Length(1, 45)
  firstname: string;

  @IsString()
  @Length(1, 45)
  lastname: string;

  @IsString()
  country: string;

  @IsNotEmpty()
  quantity: number;
}
