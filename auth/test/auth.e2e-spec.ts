import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prismaService = app.get(PrismaService);
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
  });

  describe('signUp POST', () => {
    it('should failed with all error messages', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .expect(400);

      expect(res.body.statusCode).toBe(400);
      expect(res.body.message).not.toBeUndefined();
    });

    it('should create new users in database', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'rock@user.delete',
          password: 'pass1234',
          age: 24,
          name: 'rocky user',
          bio: 'I am gonna rock the micro universe created by you',
        })
        .expect(201);
      // console.log({ body: res.body });
      expect(res.body).toHaveProperty('access_token');
      expect(res.body).not.toBeUndefined();
    });
  });

  describe('SignIn Post - tests', () => {
    it('should failed because of wrong password', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'rock@user.delete',
          password: 'pass12345',
        })
        .expect(403);
    });

    it('should failed because of wrong email', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'rock2@user.delete',
          password: 'pass1234',
        })
        .expect(403);
    });

    it('should sign in user and return access token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'rock@user.delete',
          password: 'pass1234',
        })
        .expect(200);

      expect(res.body).not.toBeUndefined();
      expect(res.body).toHaveProperty('access_token');
    });
  });
});
