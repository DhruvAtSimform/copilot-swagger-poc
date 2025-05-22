import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { GetUser } from 'src/decorator';
import { CommentService } from './comment.service';
import { AddCommentDto, GetCommentsQueryDto } from './dto';

@Controller('comment')
export class CommentController {
  // here we have 1 level comment system. In future we may add reply by tagging someone.

  constructor(private readonly commentService: CommentService) {}

  // add comment on entity
  @Post('create')
  addComment(
    @Body(new ValidationPipe({ whitelist: true })) addCommentDto: AddCommentDto,
    @GetUser() user: { [key: string]: string },
  ) {
    return this.commentService.addCommentOrReply(addCommentDto, user);
  }

  // fetch comments for post
  @Get('/')
  getComments(
    @Query(new ValidationPipe({ whitelist: true })) query: GetCommentsQueryDto,
  ) {
    return this.commentService.fetchComments(query);
  }

  // delete comment and child
  @Delete('/delete/:id')
  deleteComment(@Param('id') id: string, @GetUser('id') uid: string) {
    return this.commentService.deleteComment(id, uid);
  }
}
