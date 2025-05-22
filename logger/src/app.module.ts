import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import getConfiguredLogger from './config/configuration';

@Module({
  imports: [WinstonModule.forRoot(getConfiguredLogger())],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
