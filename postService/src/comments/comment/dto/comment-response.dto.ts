import { ApiProperty } from '@nestjs/swagger';
import { Schema } from 'mongoose';

export class CommentResponseDto {
  @ApiProperty({
    description: 'Comment ID',
    example: '60d21b4667d0d8992e610c85',
  })
  _id: string;

  @ApiProperty({
    description: 'Comment text content',
    example: 'This is a great post! I learned a lot from it.',
  })
  text: string;

  @ApiProperty({
    description: 'User ID who created the comment',
    example: '60d21b4667d0d8992e610c85',
  })
  userId: Schema.Types.ObjectId;

  @ApiProperty({
    description: 'ID of the entity (post) being commented on',
    example: '60d21b4667d0d8992e610c85',
  })
  entityId: Schema.Types.ObjectId;

  @ApiProperty({
    description: 'Type of the entity',
    example: 'POST',
    enum: ['POST'],
  })
  entityType: 'POST';

  @ApiProperty({
    description: 'Parent comment ID (for nested comments)',
    example: '60d21b4667d0d8992e610c85',
  })
  parentId?: Schema.Types.ObjectId;

  @ApiProperty({
    description: 'Comment creation timestamp',
    example: '2023-06-20T15:24:34.897Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Comment update timestamp',
    example: '2023-06-20T15:24:34.897Z',
  })
  updatedAt: Date;

  @ApiProperty({ description: 'Number of likes on this comment', example: 5 })
  likeCount?: number;
}
