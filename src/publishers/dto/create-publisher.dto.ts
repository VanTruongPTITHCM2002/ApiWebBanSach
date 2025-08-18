import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePublisherDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  publisherName: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 255)
  publisherAddress: string;
}
