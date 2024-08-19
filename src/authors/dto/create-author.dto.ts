import { IsEmpty, IsString, Length } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @IsEmpty()
  @Length(1, 45)
  firstname: string;

  @IsString()
  @IsEmpty()
  @Length(1, 45)
  lastname: string;
}
