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

export class AddCommentDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10000)
  @MinLength(1)
  text: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(24)
  @MaxLength(24)
  entityId: Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsEnum({ POST: 'POST' })
  entityType: 'POST';

  @IsOptional()
  @IsAlphanumeric()
  @MinLength(24)
  @MaxLength(24)
  parentId: Schema.Types.ObjectId;
}
