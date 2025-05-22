import {
  IsAlphanumeric,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Schema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class AddCommentDto {
  @ApiProperty({
    description: 'The text content of the comment',
    example: 'This is a great post! I learned a lot from it.',
    minLength: 1,
    maxLength: 10000,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10000)
  @MinLength(1)
  text: string;

  @ApiProperty({
    description: 'ID of the entity (post) being commented on',
    example: '60d21b4667d0d8992e610c85',
    minLength: 24,
    maxLength: 24,
  })
  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(24)
  @MaxLength(24)
  entityId: Schema.Types.ObjectId;

  @ApiProperty({
    description: 'Type of the entity',
    example: 'POST',
    enum: ['POST'],
  })
  @IsNotEmpty()
  @IsEnum({ POST: 'POST' })
  entityType: 'POST';

  @ApiProperty({
    description: 'Parent comment ID (for nested comments)',
    example: '60d21b4667d0d8992e610c85',
    minLength: 24,
    maxLength: 24,
  })
  @IsOptional()
  @IsAlphanumeric()
  @MinLength(24)
  @MaxLength(24)
  parentId: Schema.Types.ObjectId;
}
