import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { PATTERN } from '../utils/utils';

export class FetchAuthorsDto {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @Matches(PATTERN, { message: 'invalid ids', each: true })
  readonly authorIds: string[];
}
