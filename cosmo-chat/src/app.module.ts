import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ChatsModule } from './chats/chats.module';
import { LoggerModule } from './logger/logger.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AllExceptionsFilter } from './exceptionFilter/http-exception.filter';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    DatabaseModule,
    ChatsModule,
    LoggerModule,
    JwtModule.register({}),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: 'APP_FILTER', useClass: AllExceptionsFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
