import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { sendMailDto } from './dtos';

@Controller('mail')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @HttpCode(HttpStatus.OK)
  // @Post('send')
  // sendMail(
  //   @Body(new ValidationPipe({ whitelist: true })) mailDto: sendMailDto,
  // ) {
  //   this.appService.sendMail(mailDto);
  // }

  @EventPattern('send_mail')
  async handelMailSender(
    @Payload() data: sendMailDto,
    @Ctx() context: RmqContext,
  ) {
    try {
      return await this.appService.sendMail(data);
    } catch (error) {
      console.log(error);
    }
  }
}
