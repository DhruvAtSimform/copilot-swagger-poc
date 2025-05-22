import {
  Body,
  Controller,
  Delete,
  ParseUUIDPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { GetUser } from '../../decorator/';
import { AddLikeDto } from '../dtos';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

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
