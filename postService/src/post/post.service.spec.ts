import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';

describe('PostService', () => {
  let Postservice: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService],
    }).compile();

    Postservice = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(Postservice).toBeDefined();
  });
});
