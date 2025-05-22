import {
  IsAlphanumeric,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Schema } from 'mongoose';

export class GetCommentsQueryDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(24)
  @MaxLength(24)
  entityId: Schema.Types.ObjectId;

  @IsOptional()
  @IsAlphanumeric()
  @MinLength(24)
  @MaxLength(24)
  parentId: Schema.Types.ObjectId;
}
