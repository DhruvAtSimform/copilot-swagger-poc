import { IsAlphanumeric, MaxLength, MinLength } from 'class-validator';

export class DeleteParamDto {
  @IsAlphanumeric()
  @MinLength(24)
  @MaxLength(24)
  id: string;
}
