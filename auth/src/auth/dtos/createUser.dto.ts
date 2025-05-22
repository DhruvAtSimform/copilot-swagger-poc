import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;

  @IsString()
  @IsNotEmpty()
  bio?: string;

  @IsNotEmpty()
  @Min(12)
  @Max(150)
  age?: number;
}
