import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema, Comment } from './schemas/comment.schema';
import { Entity, EntitySchema } from './schemas/entity.schema';
import { Like, LikeSchema } from './schemas/like.schema';
import { Post, PostSchema } from './schemas/post.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Entity.name, schema: EntitySchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
