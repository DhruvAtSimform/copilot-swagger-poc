import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { LoginDto, SignupDto } from './dtos';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserMailEvent } from '../events';

@Injectable()
export class AuthService {
  constructor(
    @Inject('MAILER_SERVICE')
    private readonly mailerClient: ClientProxy,
    private readonly prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async createUser(
    createUSerDto: SignupDto,
  ): Promise<{ access_token: string }> {
    const hash = await argon.hash(createUSerDto.password, {
      type: argon.argon2id,
    });
    try {
      const user = await this.prisma.user.create({
        data: { ...createUSerDto, password: hash },
      });
      this.mailerClient.emit(
        'send_mail',
        new CreateUserMailEvent('WELCOME_MAIL', user.email, user.name),
      );
      return await this.signToken(user.id, user.name);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message
          ? error
          : {
              message: 'Something went wrong, try later',
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            },
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signin(dto: LoginDto): Promise<{ access_token: string }> {
    try {
      // find the user by email
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      // if user does not exist then throw excpetion
      if (!user)
        throw new HttpException(
          { message: 'Credentials Incorrect.', error: 'Unauthorised' },
          403,
        );

      // if user exist, compare password
      // if does not match then throw exception
      if (!(await argon.verify(user.password, dto.password))) {
        throw new HttpException(
          { message: 'Credentials Incorrect.', error: 'Unauthorised' },
          403,
        );
      }

      //send back the user
      return await this.signToken(user.id, user.name);

      //sendback the token
      // return this.signToken(user.id, user.email);
    } catch (error) {
      throw new HttpException(
        error.message
          ? error
          : {
              message: 'Something went wrong, try later',
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            },
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //function to create and return jwt tokens. uses the nestjs-jwt and other package
  // to do so.
  async signToken(id: string, name: string): Promise<{ access_token: string }> {
    const token = await this.jwt.signAsync(
      { id, name },
      {
        expiresIn: '1d',
        secret: this.config.get('JWT_SECRET_KEY'),
        issuer: this.config.get('KONG_JWT_ISS'),
      },
    );
    return {
      access_token: token,
    };
  }
}
