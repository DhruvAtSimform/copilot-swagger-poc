import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsAlphanumeric,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  Matches,
} from 'class-validator';
import { PATTERN } from 'src/utils/index.util';

export class UpdateChatGroupDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsAlphanumeric()
  @IsNotEmpty()
  @MinLength(24)
  @MaxLength(24)
  chatGroupId: string;
}

export class AddMembersDto {
  @IsAlphanumeric()
  @IsNotEmpty()
  @MinLength(24)
  @MaxLength(24)
  chatGroupId: string;

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

export class RemoveMemberDto {
  @IsAlphanumeric()
  @IsNotEmpty()
  @MinLength(24)
  @MaxLength(24)
  chatGroupId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(36, {
    message: 'Invalid memberId',
  })
  @MaxLength(36, {
    message: 'Invalid memberId',
  })
  @Matches(PATTERN, { message: 'Invalid memberId' })
  memberId: string;
}
