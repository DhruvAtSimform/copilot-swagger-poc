import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  Matches,
} from 'class-validator';
import { PATTERN } from 'src/utils/index.util';

export class CreateChatGroupDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(25)
  @MinLength(36, {
    each: true,
  })
  @MaxLength(36, {
    each: true,
  })
  @Matches(PATTERN, { message: 'Invalid memberIds', each: true })
  members: string[];
}
