import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import mongoose, { Model, Schema } from 'mongoose';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CreatePostDto, MyPostQuery, UpdatePostDto } from './dtos';
import { Post, PostDocument } from '../database/schemas/post.schema';
import { ErrorMessageGenerator } from './utils/index.util';
import { Entity, EntityDocument } from 'src/database/schemas/entity.schema';
import { CommentService } from 'src/comments/comment/comment.service';
import { CommentDocument, Comment } from 'src/database/schemas/comment.schema';
// import { Like, LikeDocument } from 'src/database/schemas/like.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private readonly commentService: CommentService,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private cloudinaryService: CloudinaryService,
  ) {}

  async fetchPosts(uid: string, query: MyPostQuery) {
    const sort = { createdAt: 1 };

    if (query.sortBy) {
      const parts = query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
      // console.log(sort);
    }

    const limit = Number.isInteger(parseInt(query.limit))
      ? parseInt(query.limit)
      : 10;

    const skip = Number.isInteger(parseInt(query.skip))
      ? parseInt(query.skip)
      : 0;

    try {
      const posts = await this.postModel
        .find({ authorId: { $ne: uid } }, {}, { skip, limit, sort })
        .populate('likeCount');
      return posts;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        ErrorMessageGenerator(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async fetchMyPosts(uid: string, query?: MyPostQuery) {
    const sort = {};

    if (query.sortBy) {
      const parts = query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
      // console.log(sort);
    }

    const limit = Number.isInteger(parseInt(query.limit))
      ? parseInt(query.limit)
      : 0;

    const skip = Number.isInteger(parseInt(query.skip))
      ? parseInt(query.skip)
      : 0;

    try {
      // const posts = await this.postModel.find({ where: { authorId: uid, completed }, });
      const posts = await this.postModel
        .find({ authorId: uid }, {}, { skip, limit, sort })
        .populate('likeCount');
      return posts;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        ErrorMessageGenerator(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createPost(
    uid: string,
    filePath: string,
    createPostDto: CreatePostDto,
  ) {
    try {
      const entity = new this.entityModel({ userId: uid, type: 'POST' });
      const post = new this.postModel({
        ...createPostDto,
        authorId: uid,
        _id: entity._id,
      });

      // uploading the image to cloudinary server\
      const result = await this.cloudinaryService.uploadImage(
        filePath,
        post._id,
      );
      if (!result) throw new Error('something went wrong, please try again');
      post.postImageUrl = result.secure_url;

      // start session , commit new entity and post.
      const session = await this.connection.startSession();
      const t = await session.withTransaction(
        async () => {
          await entity.save({ session });
          await post.save({ session });
        },
        { readConcern: { level: 'local' }, writeConcern: { w: 'majority' } },
      );
      session.endSession();

      return post;
    } catch (error) {
      // console.error(error);
      throw new HttpException(
        ErrorMessageGenerator(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async fetchPostById(id: string, uid: string) {
    try {
      const post = await this.postModel
        .findOne({ _id: id, authorId: uid })
        .populate('likeCount');
      // console.log(post);
      if (!post) throw new Error('bad request, no such post');
      return post;
    } catch (error) {
      // console.error(error);
      throw new HttpException(
        ErrorMessageGenerator(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updatePost(
    updatePostDto: UpdatePostDto,
    uid: string,
    filePath?: string,
  ) {
    try {
      const post = await this.postModel.findOne({
        _id: updatePostDto.id,
        authorId: uid,
      });
      if (!post)
        throw new HttpException(
          'bad request, can not find post',
          HttpStatus.NOT_FOUND,
        );

      let res: UploadApiResponse | UploadApiErrorResponse;

      if (filePath) {
        res = await this.cloudinaryService.uploadImage(
          filePath,
          updatePostDto.id,
        );
        if (!res)
          throw new Error(
            res.http_code
              ? res.message
              : 'unable to update image, please try later',
          );
      }

      delete updatePostDto.id;
      Object.keys(updatePostDto).forEach((key) => {
        post[key] = updatePostDto[key];
      });

      if (res) post.postImageUrl = res.secure_url;
      await (await post.save()).populate('likeCount');

      return post;
    } catch (error) {
      // console.error(error);
      throw new HttpException(
        ErrorMessageGenerator(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deletePostById(id: string, uid: string) {
    try {
      let post;
      const session = await this.connection.startSession();
      await session.withTransaction(async () => {
        post = await this.postModel.findOneAndDelete(
          {
            _id: id,
            authorId: uid,
          },
          { session },
        );

        if (!post) throw new Error('bad request, no such post');

        await this.entityModel.deleteOne(
          { _id: id, userId: uid, type: 'POST' },
          { session },
        );

        const comments = await this.commentModel.find(
          { entityId: id, userId: uid, parentId: null },
          { _id: 1, parentId: 1, entityId: 1 },
          { session },
        );
        console.log(comments);

        for (let i = 0; i < comments.length; i++) {
          await this.commentService.deleteComment(
            comments[i]._id.toHexString(),
            uid,
          );
        }
      });

      const res = await this.cloudinaryService.deleteImage(id);
      if (!res.result || res.result !== 'ok')
        throw new Error('bad request, no such post');
      post.postImageUrl = null;
      return post;
    } catch (error) {
      throw new HttpException(
        ErrorMessageGenerator(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async serchPost(keyword: string) {
    try {
      console.log(keyword);
      const posts = await this.postModel
        .find({ $text: { $search: keyword } })
        .populate('likeCount');
      return posts;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        ErrorMessageGenerator(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async cascadeUserAccountDelete(uid: string) {
    try {
      const posts = await this.postModel.find({ authorId: uid }, { _id: 1 });
      console.log(posts);
      const promises: Promise<any>[] = [];
      for (let i = 0; i < posts.length; i++) {
        promises.push(this.deletePostById(posts[i]._id, uid));
      }
      await Promise.all(promises);
      return 'done';
    } catch (error) {
      throw new Error(error);
    }
  }
}
