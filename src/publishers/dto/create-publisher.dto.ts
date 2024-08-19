import { IsEmpty, IsString, Length } from 'class-validator';

export class CreatePublisherDto {
  @IsString()
  @IsEmpty()
  @Length(5, 100)
  publisherName: string;

  @IsString()
  @IsEmpty()
  @Length(5, 255)
  publisherAddress: string;
}
