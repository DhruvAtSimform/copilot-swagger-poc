import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @MinLength(10)
  title: string;

  @IsNotEmpty()
  @MinLength(300)
  @MaxLength(100000)
  description: string;

  @IsNotEmpty()
  @IsArray()
  tags: string[];

  @IsNotEmpty()
  @IsString()
  language: string;
}
