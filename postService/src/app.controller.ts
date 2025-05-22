import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomLogger } from './logger/CustomLogger';

@Controller()
export class AppController {
  constructor() {}
}
