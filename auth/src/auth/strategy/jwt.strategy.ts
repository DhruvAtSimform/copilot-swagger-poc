import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

//this is startegy - passport use this terms
// this startegy will authorised the user request coming with jwt token, we can have multiple startegy.
// one for refresh token or for google auth etc.

@Injectable()
export class JwtStartegy extends PassportStrategy(Strategy, 'jwt') {
  // 'jwt' is the name, which can be anything. just help us in authguard to access it.
  constructor(config: ConfigService, private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: { id: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });
    if (!user) {
      return null;
    }
    delete user.password;
    delete user.updatedAt;
    return user;
  }
}
