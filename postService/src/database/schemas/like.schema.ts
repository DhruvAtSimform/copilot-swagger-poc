import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Schema as Sch } from 'mongoose';

export type LikeDocument = Like & Document;

@Schema({ timestamps: true })
export class Like {
  @Prop({
    type: Sch.Types.ObjectId,
    required: true,
  })
  entityId: Sch.Types.ObjectId;

  @Prop({ type: String, enum: ['POST', 'COMMENT'] })
  @Prop({
    type: String,
    required: true,
    minLength: [36, 'Invalid UUID'],
    maxLength: [36, 'Invalid UUID'],
    index: true,
  })
  userId: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
