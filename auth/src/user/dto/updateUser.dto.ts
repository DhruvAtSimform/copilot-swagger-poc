import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  readonly name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly bio?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(12)
  @Max(150)
  readonly age?: number;
}
