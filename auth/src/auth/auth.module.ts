import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
    ClientsModule.registerAsync([
      {
        name: 'MAILER_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('RABBITMQ_URI') as string],
            queue: 'mailer_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

// name: 'MAILER_SERVICE',
//          transport : Transport.RMQ,
//          options: {
//             urls: [process.env.RABBITMQ_URI],
//             queue: 'mailer_queue',
//             queueOptions: {
//               durable: false,
//             },
