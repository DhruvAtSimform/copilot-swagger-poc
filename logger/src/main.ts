import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq-micro:5672'],
        queue: 'logger_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  const logger = app.get<Logger>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  await app.listen();
  logger.log({
    level: '',
    message: 'Logger Micro Service is UP and Ready to Serve',
  });
}
bootstrap();
