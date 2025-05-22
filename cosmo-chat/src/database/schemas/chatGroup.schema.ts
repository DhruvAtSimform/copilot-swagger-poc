import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as Sch } from 'mongoose';

export type ChatGroupDocument = ChatGroup & Document;

@Schema({ timestamps: true })
export class ChatGroup {
  @Prop({
    type: String,
    required: [true, 'chat group name is required'],
    minLength: [1, 'chatgroup name must be greater than 1'],
    maxLength: [251, 'chatgroup cannot be longer than 251'],
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    trim: true,
    minLength: [36, 'Invalid adminId'],
    maxLength: [36, 'Invalid adminId'],
    required: [true, 'group admin is required'],
  })
  adminId: string;

  @Prop({
    type: [
      {
        type: String,
        trim: true,
        minLength: [36, 'Invalid userId'],
        maxLength: [36, 'Invalid userId'],
      },
    ],
    required: true,
    validate: {
      validator: function (v: Array<string>) {
        return v.length < 1 || v.length > 255
          ? 'Too much or less membres'
          : undefined;
      },
    },
  })
  members: Array<string>;

  @Prop({
    type: String,
    trim: true,
  })
  profileImg: string;
}

const ChatGroupSchema = SchemaFactory.createForClass(ChatGroup);

ChatGroupSchema.index({ _id: 1, adminId: 1 });

/* CommentSchema.index({ createdAt: 1 });


CommentSchema.virtual('likeCount', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'entityId',
  count: true,
}); */

export { ChatGroupSchema };
