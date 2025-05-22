import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    console.log('//////////////// middleware ////////////////');
    this.loggerService.sendLog(
      'info',
      `Incoming ${req.method} ${req.originalUrl} ${req.hostname}`,
      'Auth',
    );
    next();
  }
}
