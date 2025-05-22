import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';

// we can apply a global middleware using app.use method.
// but it is has caveats -- can't use injectable class have to use function instead
// so we are doing jugad by adding middleware to appModule with forRoutes(*)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggerService = app.get(LoggerService);
  // const httpAdapter = app.get(HttpAdapterHost).httpAdapter;
  // app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(7001, () => {
    loggerService.sendLog('info', 'Auth Service is running on port 7001');
    console.log('Nest Application running on port 7001');
  });
}
bootstrap();
