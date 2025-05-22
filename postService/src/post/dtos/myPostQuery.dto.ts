import { ApiProperty } from '@nestjs/swagger';

export class MyPostQuery {
  @ApiProperty({
    description: 'Sort criteria',
    example: 'createdAt:desc',
  })
  sortBy: string;

  @ApiProperty({
    description: 'Maximum number of items to return',
    example: '10',
  })
  limit: string;

  @ApiProperty({
    description: 'Number of items to skip',
    example: '0',
  })
  skip: string;
}
