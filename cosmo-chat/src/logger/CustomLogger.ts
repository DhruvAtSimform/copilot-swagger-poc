import { ConsoleLogger } from '@nestjs/common';
import { LoggerService } from './logger.service';

export class CustomLogger extends ConsoleLogger {
  constructor(private logger: LoggerService) {
    super();
  }

  error(message: any, stack?: string, context?: string) {
    // add your tailored logic here
    this.logger.sendLog('error', message, 'post', stack);
    super.error(message, ...arguments);
  }

  log(message: any, context?: string): void;
  log(message: any, ...optionalParams: any[]): void {
    this.logger.sendLog('info', message, 'post');
    super.log(message, ...arguments);
  }

  warn(message: any, context?: string): void;
  warn(message: any, ...optionalParams: any[]): void {
    this.logger.sendLog('warn', message, 'post');
    super.warn(message, ...arguments);
  }

  debug(message: any, context?: string): void;
  debug(message: any, ...optionalParams: any[]): void;
  debug(message: unknown, context?: unknown, ...rest: unknown[]): void {
    super.debug(message, ...arguments);
  }

  verbose(message: any, context?: string): void;
  verbose(message: any, ...optionalParams: any[]): void;
  verbose(message: unknown, context?: unknown, ...rest: unknown[]): void {
    super.verbose(message, ...arguments);
  }
}
