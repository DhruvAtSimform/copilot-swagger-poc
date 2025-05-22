import { Module } from '@nestjs/common';
import { LikeController } from './like/like.controller';
import { LikeService } from './like/like.service';

@Module({
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikesModule {}
