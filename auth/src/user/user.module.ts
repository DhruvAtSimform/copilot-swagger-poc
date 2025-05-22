import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    CloudinaryModule,
    PrismaModule,
    JwtModule.register({}),
    MulterModule.register({
      storage: diskStorage({}),
    }),
    ClientsModule.registerAsync([
      {
        name: 'POST_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            queue: 'post_queue',
            urls: [configService.get('RABBITMQ_URI') as string],
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
