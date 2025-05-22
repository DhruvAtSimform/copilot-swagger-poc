import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './exceptionFilter/http-exception.filter';
// import { PrismaModule } from './prisma/prisma.module';
// import { JwtStartegy } from './strategy';
// import { AuthModule } from './authModule/auth.module';
import { LoggerModule } from './logger/logger.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UserModule } from './user/user.module';

console.log({env : process.env.NODE_ENV})
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    AuthModule,
    LoggerModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: 'APP_FILTER', useClass: AllExceptionsFilter },
  ], // JwtStartegy - should be here
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
