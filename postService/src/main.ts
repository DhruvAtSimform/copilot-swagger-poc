import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { LoggerService } from './logger/logger.service';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const customLogger = app.get(LoggerService);
  const config = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      queue: 'post_queue',
      urls: [config.get('RABBITMQ_URI')],
      queueOptions: {
        durable: false,
      },
      noAck: false,
    },
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Post Service API')
    .setDescription('API documentation for the Post Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  try {
    await app.startAllMicroservices();
    console.log('Post microservice is started successfully.');
    customLogger.sendLog('info', 'Post Service is running fine with rabbitmq');
  } catch (error) {
    console.log('error occured');
    customLogger.sendLog('error', 'Post microservice is failed to start.');
  }

  // const httpAdapter = app.get(HttpAdapterHost).httpAdapter;
  // app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(7003, () => {
    customLogger.sendLog('info', 'Post Service is running fine on port 7003');
    console.log('Nest Application running on port 7003');
  });
}
bootstrap();
