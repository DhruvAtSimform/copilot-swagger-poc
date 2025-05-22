import {
  IsAlphanumeric,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Schema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class GetCommentsQueryDto {
  @ApiProperty({
    description: 'ID of the entity (post) to fetch comments for',
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
    description: 'Parent comment ID (to fetch replies to a specific comment)',
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
