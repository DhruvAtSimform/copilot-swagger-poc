import { ApiProperty } from '@nestjs/swagger';
import { Schema } from 'mongoose';

export class LikeResponseDto {
  @ApiProperty({ description: 'Like ID', example: '60d21b4667d0d8992e610c85' })
  _id: string;

  @ApiProperty({
    description: 'User ID who liked the entity',
    example: '60d21b4667d0d8992e610c85',
  })
  userId: Schema.Types.ObjectId;

  @ApiProperty({
    description: 'ID of the liked entity (post or comment)',
    example: '60d21b4667d0d8992e610c85',
  })
  entityId: Schema.Types.ObjectId;

  @ApiProperty({
    description: 'Type of the entity',
    example: 'POST',
    enum: ['POST', 'COMMENT'],
  })
  entityType: 'POST' | 'COMMENT';

  @ApiProperty({
    description: 'Like creation timestamp',
    example: '2023-06-20T15:24:34.897Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Like update timestamp',
    example: '2023-06-20T15:24:34.897Z',
  })
  updatedAt: Date;
}
