import { ApiProperty } from '@nestjs/swagger';
import { Schema } from 'mongoose';

export class PostResponseDto {
  @ApiProperty({ description: 'Post ID', example: '60d21b4667d0d8992e610c85' })
  _id: string;

  @ApiProperty({
    description: 'Post title',
    example: 'How to use NestJS with MongoDB',
  })
  title: string;

  @ApiProperty({
    description: 'Post description',
    example:
      'This is a detailed guide on how to integrate NestJS with MongoDB...',
  })
  description: string;

  @ApiProperty({
    description: 'Post tags',
    example: ['nestjs', 'mongodb', 'tutorial'],
  })
  tags: string[];

  @ApiProperty({ description: 'Post language', example: 'en' })
  language: string;

  @ApiProperty({
    description: 'Post image URL',
    example: 'https://cloudinary.com/example-image.jpg',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Post author ID',
    example: '60d21b4667d0d8992e610c85',
  })
  authorId: Schema.Types.ObjectId;

  @ApiProperty({
    description: 'Post creation timestamp',
    example: '2023-06-20T15:24:34.897Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Post update timestamp',
    example: '2023-06-20T15:24:34.897Z',
  })
  updatedAt: Date;

  @ApiProperty({ description: 'Number of likes', example: 42 })
  likeCount: number;
}

export class FeedQueryDto {
  @ApiProperty({ description: 'Sort criteria', example: 'createdAt:desc' })
  sortBy?: string;

  @ApiProperty({
    description: 'Maximum number of items to return',
    example: '10',
  })
  limit?: string;

  @ApiProperty({ description: 'Number of items to skip', example: '0' })
  skip?: string;
}
