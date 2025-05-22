import { Module } from '@nestjs/common';
import { CommentService } from './comment/comment.service';
import { CommentController } from './comment/comment.controller';

@Module({
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentsModule {}
