//  purpose of this guard is actually not to guard. Just use jwt signed id to fetch user frm database
//  and add to request as req.user. so other services can utilize it.
// yes ut can be better implemented as middleware. Because most of our routes will use this so we can
//  config that in *.module.ts file as middleware.

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  //   canActivate(
  //     context: ExecutionContext,
  //   ): boolean | Promise<boolean> |  {
  //     const request = context.switchToHttp().getRequest();
  //     return true;
  //   }
  constructor(private jwt: JwtService, private prisma: PrismaService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const token = request.headers.authorization.replace('Bearer ', '');
      const decoded = this.jwt.decode(token) as { [key: string]: string };
      //   console.log({ decoded });
      //   throw new Error();
      if (decoded.id) {
        const user = this.prisma.user.findUnique({
          select: {
            id: true,
            age: true,
            bio: true,
            createAt: true,
            name: true,
            profileURL: true,
          },
          where: { id: decoded.id },
        });
        // console.log({ user });
        if (!user) {
          return null;
        }
        request.user = user;
        return true;
      }
    } catch (error) {
      return false;
    }
  }
}
