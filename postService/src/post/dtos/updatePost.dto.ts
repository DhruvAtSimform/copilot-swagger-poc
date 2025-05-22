import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({
    description: 'The ID of the post to update',
    example: '60d21b4667d0d8992e610c85',
    minLength: 24,
    maxLength: 24,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(24)
  @MaxLength(24)
  id: string;

  @ApiProperty({
    description: 'The updated title of the post',
    example: 'Updated: How to use NestJS with MongoDB',
    minLength: 10,
  })
  @IsOptional()
  @IsNotEmpty()
  @MinLength(10)
  title?: string;

  @ApiProperty({
    description: 'The updated content of the post',
    example:
      'This is an updated guide on how to integrate NestJS with MongoDB...',
    minLength: 300,
    maxLength: 100000,
  })
  @IsOptional()
  @IsNotEmpty()
  @MinLength(300)
  @MaxLength(100000)
  description?: string;

  @ApiProperty({
    description: 'Updated list of tags for the post',
    example: ['nestjs', 'mongodb', 'updated'],
    isArray: true,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  tags?: string[];

  @ApiProperty({
    description: 'Updated language of the post content',
    example: 'fr',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  language?: string;
}
