import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerService } from './logger.service';

//unable to get env variable. there's catch
// execution or intialization of module can differ the intialization time
//  which is a reason to get conflict. never depends on default configuration service, use the dot env
//  package.
@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        //This will be used as a Token for the Controller to Inject the Client Proxy
        name: 'LOGGER_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('RABBITMQ_URI') as string],
            queue: 'logger_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
