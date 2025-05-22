import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Entity, EntityDocument } from 'src/database/schemas/entity.schema';
import { ErrorMessageGenerator } from 'src/post/utils/index.util';
import { Like, LikeDocument } from '../../database/schemas/like.schema';

type entity = 'POST' | 'COMMENT';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
  ) {}

  async addNewLike(
    postId: Schema.Types.ObjectId,
    uid: string,
    entityType: entity,
  ) {
    try {
      const entity = await this.entityModel.findOne({
        _id: postId,
        type: entityType,
      });
      if (!entity) {
        throw new Error('Invalid Request, No Post');
      }
      const like = await this.likeModel.findOneAndUpdate(
        {
          userId: uid,
          entityId: entity._id,
        },
        {
          userId: uid,
          entityId: entity._id,
        },
        { upsert: true, new: true },
      );
      if (!like) throw new Error('sorry, can not add like now.');
      return { added: true };
    } catch (error) {
      throw new HttpException(
        ErrorMessageGenerator(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeLike(
    postId: Schema.Types.ObjectId,
    uid: string,
    entityType: entity,
  ) {
    try {
      const like = await this.likeModel.findOneAndDelete({
        entityId: postId,
        userId: uid,
        entityType,
      });
      if (!like) throw new Error('Invalid Data');
      return { removed: true };
    } catch (error) {
      throw new HttpException(
        ErrorMessageGenerator(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
