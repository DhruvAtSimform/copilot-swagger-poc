import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should defined appController', () => {
      expect(appController).toBeDefined();
    });
  });

  describe('getProfile', () => {
    describe('when get Profile is called', () => {
      let user: any;

      beforeEach(async () => {
        user = await appController.getProfile({ user: null });
      });

      test('then it should return a user', () => {
        expect(user).toBeNull();
      });
    });
  });
});
