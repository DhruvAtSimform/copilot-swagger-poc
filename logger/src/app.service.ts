import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { LogDataDto } from './dto/logdata.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  logData(data: LogDataDto) {
    switch (data.level) {
      case 'info':
        this.logger.info(data);
        break;
      case 'error':
        this.logger.error(data);
        break;
      default:
        break;
    }
  }
}
