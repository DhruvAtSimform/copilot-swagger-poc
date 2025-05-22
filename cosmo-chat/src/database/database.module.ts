import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGroupSchema, ChatGroup } from './schemas/chatGroup.schema';
import { Message, MessageSchema } from './schemas/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatGroup.name, schema: ChatGroupSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
