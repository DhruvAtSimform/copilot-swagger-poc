import {
  IsAlphanumeric,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { PATTERN } from 'src/utils/index.util';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(10000)
  text: string;

  @IsAlphanumeric()
  @IsNotEmpty()
  @MinLength(24)
  @MaxLength(24)
  chatGroupId: string;
}

export class GetMessageQueryDto {
  @IsAlphanumeric()
  @IsNotEmpty()
  @MinLength(24)
  @MaxLength(24)
  chatGroupId: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  skip: number;

  @IsNumber()
  @IsOptional()
  @Min(10)
  limit: number;
}
