import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'How to use NestJS with MongoDB',
    minLength: 10,
  })
  @IsNotEmpty()
  @MinLength(10)
  title: string;

  @ApiProperty({
    description: 'The detailed content of the post',
    example:
      'This is a detailed guide on how to integrate NestJS with MongoDB...',
    minLength: 300,
    maxLength: 100000,
  })
  @IsNotEmpty()
  @MinLength(300)
  @MaxLength(100000)
  description: string;

  @ApiProperty({
    description: 'List of tags for the post',
    example: ['nestjs', 'mongodb', 'tutorial'],
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  tags: string[];

  @ApiProperty({
    description: 'The language of the post content',
    example: 'en',
  })
  @IsNotEmpty()
  @IsString()
  language: string;
}
