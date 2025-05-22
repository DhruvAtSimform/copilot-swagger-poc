import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { LogDataDto } from './dto/logdata.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('log_data')
  catchLogData(@Payload() data: LogDataDto, @Ctx() context: RmqContext) {
    console.log('got our data');
    this.appService.logData(data);
  }
}
