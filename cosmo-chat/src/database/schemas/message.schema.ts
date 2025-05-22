import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as Sch } from 'mongoose';

export type MessageDocument = Message & Document;

// text, timestamps, writtenby, grpId,

@Schema({ timestamps: true })
export class Message {
  @Prop({
    type: String,
    required: [true, 'message text is required'],
    minLength: [1, 'message must be greater than 1'],
    maxLength: [4096, 'message cannot be longer than 4096'],
    trim: true,
  })
  text: string;

  @Prop({
    type: Sch.Types.ObjectId,
    ref: 'ChatGroup',
    required: [true, 'GroupId is required'],
  })
  chatGroupId: Sch.Types.ObjectId;

  @Prop({
    type: String,
    trim: true,
    minLength: [36, 'Invalid adminId'],
    maxLength: [36, 'Invalid adminId'],
    required: [true, 'group admin is required'],
  })
  userId: string;

  // @Prop({ type: Sch.Types.ObjectId, default: null })
  // parentId: Sch.Types.ObjectId;
}

const MessageSchema = SchemaFactory.createForClass(Message);

// MessageSchema.index({ createdAt: 1 });

MessageSchema.index({ groupId: 1, createdAt: 1 });

// MessageSchema.virtual('likeCount', {
//   ref: 'Like',
//   localField: '_id',
//   foreignField: 'entityId',
//   count: true,
// });

export { MessageSchema };
