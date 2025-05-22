import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class LoggerService {
  constructor(
    @Inject('LOGGER_SERVICE') private readonly loggerClient: ClientProxy,
  ) {}

  sendLog(
    level: string,
    message: string,
    service: string = 'Cosmo Chat',
    callStack?: string,
  ) {
    try {
      this.loggerClient.emit('log_data', {
        level,
        service,
        message,
        callStack,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
