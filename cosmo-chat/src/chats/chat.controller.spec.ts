import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';

describe('ChatController', () => {
  let chatController: ChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
    }).compile();

    chatController = module.get<ChatController>(ChatController);
  });

  it('should be defined', () => {
    expect(chatController).toBeDefined();
  });
});
