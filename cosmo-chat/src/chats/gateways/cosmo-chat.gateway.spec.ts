import { Test, TestingModule } from '@nestjs/testing';
import { CosmoChatGateway } from './cosmo-chat.gateway';

describe('CosmoChatGateway', () => {
  let gateway: CosmoChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CosmoChatGateway],
    }).compile();

    gateway = module.get<CosmoChatGateway>(CosmoChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
