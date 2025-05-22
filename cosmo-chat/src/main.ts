import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const result = config({
    path: resolve(process.cwd(), './prod.env'),
    override: true,
  });
  if (result.parsed) {
    const app = await NestFactory.create(AppModule);
    app.enableCors({ origin: '*' });
    const customLogger = app.get(LoggerService);
    const config = app.get(ConfigService);

    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        queue: 'chat_queue',
        urls: [config.get('RABBITMQ_URI')],
        queueOptions: {
          durable: false,
        },
        noAck: false,
      },
    });

    try {
      await app.startAllMicroservices();
      console.log('Chat microservice is started successfully.');
      customLogger.sendLog(
        'info',
        'Chat Service is running fine with rabbitmq',
      );
    } catch (error) {
      console.log('error occured');
      customLogger.sendLog('error', 'Chat microservice is failed to start.');
    }

    // const httpAdapter = app.get(HttpAdapterHost).httpAdapter;
    // app.useGlobalFilters(new AllExceptionsFilter());
    await app.listen(7004, () => {
      customLogger.sendLog(
        'info',
        'Cosmo Chat Server is running fine on port 7003',
      );
      console.log('Cosmo Chat server is running on port 7004');
    });
  } else {
    throw result.error;
  }
}
bootstrap();

// cvgf vdfd rrrt
