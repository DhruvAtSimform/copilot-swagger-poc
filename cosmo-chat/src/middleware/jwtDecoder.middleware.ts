import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

// this is the decoder middleware, I think it's better to use middleware for just decoding the jwt and send result with req.user

@Injectable()
export class JwtDecoderMiddleware implements NestMiddleware {
  constructor(private readonly jwtSerice: JwtService) {}

  use(req: Request, _: Response, next: NextFunction) {
    // console.log('//////////////// middleware ////////////////');
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '');
      const user = this.jwtSerice.decode(token);
      // console.log(user);
      req['user'] = user;
      return next();
    }
    next(new UnauthorizedException());
  }
}
