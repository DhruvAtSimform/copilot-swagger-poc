import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Schema as Sch } from 'mongoose';

export type EntityDocument = Entity & Document;

type entity = 'POST' | 'COMMENT';

@Schema({ timestamps: true })
export class Entity {
  @Prop({
    type: String,
    minLength: [36, 'Invalid UUID'],
    maxLength: [36, 'Invalid UUID'],
    required: true,
  })
  userId: string;

  @Prop({ type: String, enum: ['Post', 'Comment'] })
  entityType: entity;
}

const EntitySchema = SchemaFactory.createForClass(Entity);

EntitySchema.index({ userId: 1, entityType: 1 });

export { EntitySchema };
