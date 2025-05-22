import {
  Body,
  Controller,
  Delete,
  ParseUUIDPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
  ApiExtraModels,
} from '@nestjs/swagger';
import { GetUser } from '../../decorator/';
import { AddLikeDto } from '../dtos';
import { LikeService } from './like.service';
import { LikeResponseDto } from '../dtos/like-response.dto';

@ApiTags('like')
@ApiBearerAuth()
@ApiExtraModels(LikeResponseDto)
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiOperation({ summary: 'Add a like to a post or comment' })
  @ApiBody({ type: AddLikeDto })
  @ApiResponse({
    status: 201,
    description: 'Like added successfully',
    type: LikeResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input' })
  @Post('add/')
  addLike(
    @Body(new ValidationPipe({ whitelist: true }))
    addLikeDto: AddLikeDto,
    @GetUser('id', ParseUUIDPipe) uid: string,
  ) {
    // console.log(param, uid);
    return this.likeService.addNewLike(
      addLikeDto.entityId,
      uid,
      addLikeDto.entityType,
    );
  }

  @ApiOperation({ summary: 'Remove a like from a post or comment' })
  @ApiQuery({ type: AddLikeDto })
  @ApiResponse({ status: 200, description: 'Like removed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input' })
  @Delete('remove/:id')
  removeLike(
    @Query(new ValidationPipe({ whitelist: true }))
    addLikeDto: AddLikeDto,
    @GetUser('id', ParseUUIDPipe) uid: string,
  ) {
    return this.likeService.removeLike(
      addLikeDto.entityId,
      uid,
      addLikeDto.entityType,
    );
  }
}
