import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class UpdatePostDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(24)
  @MaxLength(24)
  id: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(10)
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(300)
  @MaxLength(100000)
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  language?: string;
}
