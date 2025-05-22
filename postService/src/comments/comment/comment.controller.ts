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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiExtraModels,
} from '@nestjs/swagger';
import { GetUser } from 'src/decorator';
import { CommentService } from './comment.service';
import { AddCommentDto, GetCommentsQueryDto } from './dto';
import { CommentResponseDto } from './dto/comment-response.dto';

@ApiTags('comment')
@ApiBearerAuth()
@ApiExtraModels(CommentResponseDto)
@Controller('comment')
export class CommentController {
  // here we have 1 level comment system. In future we may add reply by tagging someone.

  constructor(private readonly commentService: CommentService) {}

  // add comment on entity
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiBody({ type: AddCommentDto })
  @ApiResponse({
    status: 201,
    description: 'Comment added successfully',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input' })
  @Post('create')
  addComment(
    @Body(new ValidationPipe({ whitelist: true })) addCommentDto: AddCommentDto,
    @GetUser() user: { [key: string]: string },
  ) {
    return this.commentService.addCommentOrReply(addCommentDto, user);
  }

  // fetch comments for post
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiQuery({ type: GetCommentsQueryDto })
  @ApiResponse({
    status: 200,
    description: 'Comments fetched successfully',
    type: [CommentResponseDto],
  })
  @Get('/')
  getComments(
    @Query(new ValidationPipe({ whitelist: true })) query: GetCommentsQueryDto,
  ) {
    return this.commentService.fetchComments(query);
  }

  // delete comment and child
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID to delete', type: 'string' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not authorized to delete this comment',
  })
  @Delete('/delete/:id')
  deleteComment(@Param('id') id: string, @GetUser('id') uid: string) {
    return this.commentService.deleteComment(id, uid);
  }
}
