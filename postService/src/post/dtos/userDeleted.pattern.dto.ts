import { IsString, MaxLength, MinLength } from 'class-validator';

export class UserDeletedDto {
  @IsString()
  @MaxLength(36)
  @MinLength(36)
  uid: string;
}
