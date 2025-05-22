import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { LoggerService } from 'src/logger/logger.service';
import { GetUser } from '../decorator/index';
import {
  CreatePostDto,
  MyPostQuery,
  UpdatePostDto,
  UserDeletedDto,
  PostResponseDto,
  FeedQueryDto,
} from './dtos';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiBearerAuth,
  ApiExtraModels,
} from '@nestjs/swagger';
import { PostService } from './post.service';

@ApiTags('post')
@ApiBearerAuth()
@ApiExtraModels(PostResponseDto, FeedQueryDto)
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly logger: LoggerService,
  ) {}

  @ApiOperation({ summary: 'Get feed posts' })
  @ApiQuery({
    type: FeedQueryDto,
    description: 'Query parameters for filtering posts',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched feed posts',
    type: [PostResponseDto],
  })
  @Get()
  feedsPosts(@GetUser('id') uid: string, @Query() query: MyPostQuery) {
    return this.postService.fetchPosts(uid, query);
  }

  @ApiOperation({ summary: 'Fetch all posts by user' })
  @ApiQuery({
    type: FeedQueryDto,
    description: 'Query parameters for filtering user posts',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched user posts',
    type: [PostResponseDto],
  })
  @Get('/my')
  fetchAll(@GetUser('id') uid: string, @Query() query: MyPostQuery) {
    return this.postService.fetchMyPosts(uid, query);
  }

  @ApiOperation({ summary: 'Create a new post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        post: {
          type: 'string',
          format: 'binary',
          description: 'Post image file (jpg, png, jpeg only)',
        },
        title: {
          type: 'string',
          example: 'How to use NestJS with MongoDB',
        },
        description: {
          type: 'string',
          example: 'This is a detailed guide...',
        },
        tags: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['nestjs', 'mongodb', 'tutorial'],
        },
        language: {
          type: 'string',
          example: 'en',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input or missing file',
  })
  @Post('create')
  @UseInterceptors(
    FileInterceptor('post', {
      limits: {
        fileSize: 4096e3,
      },
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
          cb(
            new HttpException(
              'File type is not supported',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe({ whitelist: true })) createPostDto: CreatePostDto,
    @GetUser('id') uid: string,
  ) {
    if (!file) {
      throw new HttpException(
        { message: 'post image is required', error: 'Bad Request' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.postService.createPost(uid, file.path, createPostDto);
  }

  @ApiOperation({ summary: 'Get post by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched post by ID',
    type: PostResponseDto,
  })
  @Get(`byId/:id`)
  getPostById(@Param('id') id: string, @GetUser('id') uid: string) {
    return this.postService.fetchPostById(id, uid);
  }

  @ApiOperation({ summary: 'Update a post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        post: {
          type: 'string',
          format: 'binary',
          description: 'Post image file (jpg, png, jpeg only)',
        },
        id: {
          type: 'string',
          example: '60d21b4667d0d8992e610c85',
        },
        title: {
          type: 'string',
          example: 'Updated: How to use NestJS with MongoDB',
        },
        description: {
          type: 'string',
          example: 'This is an updated guide...',
        },
        tags: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['nestjs', 'mongodb', 'updated'],
        },
        language: {
          type: 'string',
          example: 'fr',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input' })
  @Patch('update')
  @UseInterceptors(
    FileInterceptor('post', {
      limits: {
        fileSize: 4096e3,
      },
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
          cb(
            new HttpException(
              'File type is not supported',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  updatePost(
    @Body(new ValidationPipe({ whitelist: true })) updatePostDto: UpdatePostDto,
    @GetUser('id') uid: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postService.updatePost(
      updatePostDto,
      uid,
      file ? file.path : '',
    );
  }

  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', required: true, description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @Delete('delete/:id')
  deletePost(@Param('id') id: string, @GetUser('id') uid: string) {
    if (!id || id.length !== 24)
      throw new HttpException(
        { error: 'bad request', message: 'Invalid Post Id' },
        HttpStatus.BAD_REQUEST,
      );
    return this.postService.deletePostById(id, uid);
  }

  @ApiOperation({ summary: 'Search posts by text' })
  @ApiQuery({ name: 'key', required: true, description: 'Search keyword' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched posts by text',
  })
  @Get('/byText')
  fetchByText(@Query('key') key: string) {
    if (!key || key.length < 2) return [];
    return this.postService.serchPost(key);
  }

  @MessagePattern('user_deleted')
  async handelUserDeleted(
    @Payload(new ValidationPipe({ whitelist: true })) data: UserDeletedDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.postService.cascadeUserAccountDelete(data.uid);
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.sendLog('error', error);
    }
    return;
  }
}
