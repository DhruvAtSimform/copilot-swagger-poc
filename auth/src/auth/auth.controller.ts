import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dtos';
// import { AuthGuard } from '../user/guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  createUser(
    @Body(new ValidationPipe({ whitelist: true })) createUSerDto: SignupDto,
  ) {
    return this.authService.createUser(createUSerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  loginUser(
    @Body(new ValidationPipe({ whitelist: true })) loginUserDto: LoginDto,
  ) {
    return this.authService.signin(loginUserDto);
  }

  // @UseGuards(JwtGuard)

  /* I have implemented a jwt verification inside Kong API gateway.
    That's why i am commeting JWT strategy here. by doing so I am not able to get user in req.user.
  */
  // @UseGuards(AuthGuard)
  // @Get('profile')
  // // we can create custom decorator here to get only details which is required from user.
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}
