import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as Sch } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Comment {
  @Prop({
    type: String,
    required: true,
    minLength: 1,
    maxLength: 10000,
    trim: true,
  })
  text: string;

  @Prop({ type: Sch.Types.ObjectId, ref: 'Entity', required: true })
  entityId: Sch.Types.ObjectId;

  @Prop({
    type: String,
    trim: true,
    minLength: 36,
    maxLength: 36,
    required: true,
  })
  userId: string;

  @Prop({ type: String, trim: true, required: true })
  userName: String;

  @Prop({ type: Sch.Types.ObjectId, default: null })
  parentId: Sch.Types.ObjectId;

  likeCount: number;
}

const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.index({ createdAt: 1 });

CommentSchema.index({ entityId: 1, parentId: 1 });

CommentSchema.virtual('likeCount', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'entityId',
  count: true,
});

export { CommentSchema };
