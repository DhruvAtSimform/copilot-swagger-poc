import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllExceptionsFilter } from './exceptionFilter/http-exception.filter';
import { LoggerModule } from './logger/logger.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { PostModule } from './post/post.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    PostModule,
    LoggerModule,
    LikesModule,
    CommentsModule,
    DatabaseModule,
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
