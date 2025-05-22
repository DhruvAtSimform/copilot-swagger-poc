import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const signUpdata = () => {
  return {
    email: 'test@example.com',
    password: 'dwse 12eded32dcf32',
    name: 'dwsdsd',
  };
};

const loginData = () => {
  return {
    email: 'test@example.com',
    password: 'dwse 12eded32dcf32',
  };
};

jest.mock('./auth.service');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();
    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('is defined', () => {
    test('if controller defined', () => {
      expect(authController).toBeDefined();
    });

    test('if service defined', () => {
      expect(authService).toBeDefined();
    });
  });

  describe('createUser', () => {
    describe('when creating user called', () => {
      let token: { access_token: string };
      beforeEach(async () => {
        token = await authController.createUser(signUpdata());
      });

      test('then service method should invoked', () => {
        expect(authService.createUser).toBeCalledWith(signUpdata());
      });

      test('then cotnroller should return token', () => {
        expect(token).toHaveProperty(
          'access_token',
          'bla bla bla shake boom boom',
        );
      });
    });
  });

  describe('login user', () => {
    describe('when user login called', () => {
      let token: { access_token: string };
      beforeEach(async () => {
        token = await authController.loginUser(loginData());
      });

      test('then service method should invoked', () => {
        expect(authService.signin).toBeCalledWith(loginData());
      });

      test('then cotnroller should return token', () => {
        expect(token).toHaveProperty(
          'access_token',
          'bla bla bla shake boom boom',
        );
      });
    });
  });
});

/* 
    yes Unit testing is not that easy. Specially when you have multiple dependencies and injections.
    It would make you cry for implementing all, though those green tics and passed message should probably relief you from grim. (:
    Advice : make stubs, mocks, spies and test it. The harder you test, lesser the bugs. That's being said I would like to take leave from this. Adios!
*/
