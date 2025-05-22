import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { LoggerService } from 'src/logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly loggerService: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const callStack =
      exception instanceof HttpException ? exception.stack : undefined;

    const httpResponse =
      httpStatus === 500
        ? {
            error: 'Internal Error',
            message: 'Something Went Wrong, please try later',
          }
        : exception instanceof HttpException
        ? exception.getResponse()
        : {};

    console.log({ httpResponse, exception });
    this.loggerService.sendLog(
      'error',
      JSON.stringify(httpResponse),
      'auth',
      JSON.stringify(callStack),
    );
    httpAdapter.reply(ctx.getResponse(), httpResponse, httpStatus);
  }
}
