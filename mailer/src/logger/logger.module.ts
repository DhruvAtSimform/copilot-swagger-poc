import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerService } from './logger.service';

//unable to get env variable. there's catch
// execution or intialization of module can differ the intialization time
//  which is a reason to get conflict. never depends on default configuration service, use the dot env
//  package.
@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        //This will be used as a Token for the Controller to Inject the Client Proxy
        name: 'LOGGER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq-micro:5672/'],
          queue: 'logger_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
