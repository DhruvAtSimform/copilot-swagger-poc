import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

// jest.mock('./prisma.service');

const user = {
  name: 'vfcd',
  email: 'fddfdd',
  password: 'dfdfd',
  createAt: new Date('12-12-2012'),
  id: '12343434324',
  age: 23,
  bio: null,
  profileURL: null,
  updatedAt: new Date('12-12-2012'),
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('token'),
  verify: jest.fn().mockResolvedValue('token'),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('TOKEN'),
};

const mockPrismaService = {
  user: {
    create: jest.fn().mockResolvedValue(user),
    findUnique: jest.fn().mockResolvedValue(user),
  },
};

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

describe('AuthService', () => {
  let authService: AuthService;
  let spyPrismaService: PrismaService;
  let spyConfigService: ConfigService;
  let spyJwtService: JwtService;
  let spyMailerClient: ClientProxy;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: 'MAILER_SERVICE',
          useValue: {
            emit: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();
    authService = app.get<AuthService>(AuthService);
    spyPrismaService = app.get<PrismaService>(PrismaService);
    spyConfigService = app.get<ConfigService>(ConfigService);
    spyJwtService = app.get<JwtService>(JwtService);
    spyMailerClient = app.get<ClientProxy>('MAILER_SERVICE');
    jest.clearAllMocks();
  });

  describe('is defined', () => {
    test('if controller defined', () => {
      expect(authService).toBeDefined();
      expect(spyPrismaService.user).toBeDefined();
      expect(spyConfigService).toBeDefined();
      expect(spyJwtService).toBeDefined();
    });
  });

  describe('createUser', () => {
    describe('when createUser is called', () => {
      let token: { access_token: string };
      beforeEach(async () => {
        token = await authService.createUser(signUpdata());
      });

      test('it should call prisma -> create', () => {
        expect(spyPrismaService.user.create).toBeCalled();
      });
      test('it should call mailer -> emit', () => {
        expect(spyMailerClient.emit).toBeCalled();
      });
      test('token is here', () => {
        expect(token).toHaveProperty('access_token', 'token');
      });
    });
  });
});

/* 
    yes Unit testing is not that easy. Specially when you have multiple dependencies and injections.
    It would make you cry for implementing all, though those green tics and passed message should probably relief you from grim. (:
    Advice : make stubs, mocks, spies and test it. The harder you test, lesser the bugs. That's being said I would like to take leave from this. Adios!
*/
