import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document } from 'mongoose';
import { Like } from 'src/database/schemas/like.schema';
import { languages } from '../../post/types/post.types';

type PostDocument = Post & Document;

//to populate the fields you have to add ' toJSON : { virtuals : true} ' in your Schema decorator
// without this, you want be able to use it
@Schema({ timestamps: true, toJSON: { virtuals: true } })
class Post {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minLength: [10, 'Title should be at least 10 characters'],
    text: true,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minLength: [300, 'Description should have more than 300 characters.'],
    maxLength: [100000, 'Too long to add'],
  })
  description: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minLength: [36, 'Invalid UUID'],
    maxLength: [36, 'Invalid UUID'],
    index: true,
  })
  authorId: string;

  @Prop({ type: String, required: true })
  postImageUrl: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({
    type: String,
    required: true,
    validate: {
      validator: (v: string) => {
        // console.log(v, v.length);
        return v.length === 2;
      },
      message: (props: any) => `${props.value} is not a valid language!`,
    },
    set: (v: string) => {
      return languages[v] ? languages[v] : 'xx';
    },
  })
  language: string;

  @Type(() => Like)
  likes: Like[];

  likeCount: number;
}

const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'entityId',
});

PostSchema.virtual('likeCount', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'entityId',
  count: true,
});

export { PostSchema, Post, PostDocument };
