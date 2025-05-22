import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  //we have another way to build the microservices app.
  // remeber in nest microservice means a service not running on http.
  // so in case you have to create app listening on some port and also behaing as a
  // microservice nest app--- to listen on and do other work on tcp or event based protocol.
  //in such case we can create our normal nest app in factory.

  // const app = await NestFactory.create(AppModule)
  // 1.app.connectMicroservice({options: options})
  // 2. ...
  // after than start it by running
  // await app.startAllMicroservices()

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq-micro:5672/'],
        queue: 'mailer_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  const loggerService = app.get(LoggerService);
  await app.listen();
  loggerService.sendLog('info', 'Mailer Service Successfully Started');
}
bootstrap();
