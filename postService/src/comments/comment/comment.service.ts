import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CommentDocument, Comment } from 'src/database/schemas/comment.schema';
import { Entity, EntityDocument } from 'src/database/schemas/entity.schema';
import { Like, LikeDocument } from 'src/database/schemas/like.schema';
import { AddCommentDto, GetCommentsQueryDto } from './dto';
import { ErrorMessageGenerator } from './utils/index.util';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async addCommentOrReply(
    addCommentDto: AddCommentDto,
    user: { [key: string]: string },
  ) {
    try {
      const entity = await this.entityModel.findOne({
        _id: addCommentDto.entityId,
        type: addCommentDto.entityType,
      });
      if (!entity) {
        throw new Error('bad request, no such a entity to comment');
      }
      if (addCommentDto.parentId) {
        const parent = await this.commentModel.findOne({
          _id: addCommentDto.parentId,
          parentId: null,
        });
        if (!parent) {
          throw new Error('No such a comment to reply');
        }
      }

      const session = await this.connection.startSession();

      let comment;

      await session.withTransaction(async () => {
        const entity = new this.entityModel({
          userId: user.id,
          type: 'COMMENT',
        });

        comment = await this.commentModel.create(
          [
            {
              ...addCommentDto,
              userId: user.id,
              userName: user.name,
              _id: entity._id,
            },
          ],
          { session },
        );

        await entity.save({ session });
      });
      await session.endSession();

      return comment[0];
    } catch (error) {
      console.error(error);
      throw new HttpException(
        ErrorMessageGenerator(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async fetchComments(query: GetCommentsQueryDto) {
    const { entityId, parentId = null } = query;
    try {
      const comments = await this.commentModel
        .find({ entityId, parentId })
        .populate('likeCount');
      return comments;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        ErrorMessageGenerator(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteComment(id: string, userId: string) {
    try {
      // here we need trasaction for entity and comments. so I think we can first check if id exist and if then docker pselete.
      const ent = await this.entityModel.findOne({ _id: id, userId });
      if (!ent) {
        throw new Error('bad request, no such comment to delete');
      }

      const session = await this.connection.startSession();
      await session.withTransaction(async () => {
        const comments = await this.commentModel.find(
          { $or: [{ _id: id, userId }, { parentId: id }] },
          { _id: 1 },
          { session },
        );

        await this.entityModel.deleteMany(
          { _id: { $in: comments } },
          { session },
        );

        await this.commentModel.deleteMany(
          {
            $or: [{ _id: id, userId }, { parentId: id }],
          },
          { session },
        );

        await this.likeModel.deleteMany(
          { entityId: { $in: comments } },
          { session },
        );
      });
      await session.endSession();
      return { deleted: true };
    } catch (error) {
      throw new HttpException(
        ErrorMessageGenerator(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
