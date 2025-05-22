import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CosmoChatGateway } from 'src/chats/gateways/cosmo-chat.gateway';
import { DatabaseModule } from 'src/database/database.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { diskStorage } from 'multer';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { JwtDecoderMiddleware } from 'src/middleware/jwtDecoder.middleware';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

// as you can see, implementing thrid party service like kong gateway and their module
// don't help you too much.
@Module({
  imports: [
    DatabaseModule,
    CloudinaryModule,
    MulterModule.register({
      storage: diskStorage({}),
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          baseURL: configService.get('USER_SERVICE_URL'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService, CosmoChatGateway],
})
export class ChatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtDecoderMiddleware).forRoutes('*');
  }
}

/* 
  The problem with chat service is that We do not have direct contact with user profiles. Therefore we can not clam the userIds or memebers being added to group.
  To do so we have to send http request to Auth server. Without that we can not do it with so surety. 
*/
