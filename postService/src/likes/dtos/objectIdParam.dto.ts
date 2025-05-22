import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Schema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class AddLikeDto {
  @ApiProperty({
    description: 'ID of the entity to like (post or comment)',
    example: '60d21b4667d0d8992e610c85',
    minLength: 24,
    maxLength: 24,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(24)
  @MaxLength(24)
  entityId: Schema.Types.ObjectId;

  @ApiProperty({
    description: 'Type of the entity',
    example: 'POST',
    enum: ['POST', 'COMMENT'],
  })
  @IsNotEmpty()
  @IsEnum({ POST: 'POST', COMMENT: 'COMMENT' })
  entityType: 'POST' | 'COMMENT';
}
