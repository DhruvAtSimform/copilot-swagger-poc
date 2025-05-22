import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CommentsModule } from 'src/comments/comments.module';
import { DatabaseModule } from 'src/database/database.module';
import { JwtDecoderMiddleware } from 'src/middleware/jwtDecoder.middleware';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    CloudinaryModule,
    JwtModule.register({}),
    MulterModule.register({
      storage: diskStorage({}),
    }),
    DatabaseModule,
    CommentsModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtDecoderMiddleware).forRoutes('*');
  }
}
