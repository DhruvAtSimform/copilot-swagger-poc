import { Controller, Get, Request } from '@nestjs/common';
// // import { AuthGuard } from '@nestjs/passport';
// import { AppService } from './app.service';
// import { SignupDto, LoginDto } from './auth/dtos/index';
// import { AuthGuard, JwtGuard } from './auth/guards';

@Controller()
export class AppController {
  @Get('profile')
  // we can create custom decorator here to get only details which is required from user.
  getProfile(@Request() req) {
    return req.user;
  }
}
