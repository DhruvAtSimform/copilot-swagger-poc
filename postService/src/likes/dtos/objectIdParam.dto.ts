import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Schema } from 'mongoose';

export class AddLikeDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(24)
  @MaxLength(24)
  entityId: Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsEnum({ POST: 'POST', COMMENT: 'COMMENT' })
  entityType: 'POST' | 'COMMENT';
}
