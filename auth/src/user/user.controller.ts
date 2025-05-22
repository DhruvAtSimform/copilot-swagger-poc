import {
  Controller,
  Get,
  UseGuards,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Delete,
  Patch,
  Body,
  ValidationPipe,
  HttpCode,
  HostParam,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from './decorator';
import { AuthGuard } from './guards';
import { Express } from 'express';
import { extname } from 'path';
import { UserService } from './user.service';
import { UpdateUserDto, FetchAuthorsDto } from './dto/index';
import { isEmptyObject } from './utils/utils';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //  @UseGuards(AuthGuard)
  @Get('profile')
  // we can create custom decorator here to get only details which is required from user.
  getProfile(@GetUser() user: Express.User) {
    return user;
  }

  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 2048e3,
      },
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
          cb(
            new HttpException(
              'File type is not supported',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  @Post('profilePic')
  uploadProfilePic(
    @UploadedFile() file: Express.Multer.File,
    @GetUser('id') uid,
  ) {
    return this.userService.uploadProfile(file.path, uid);
  }

  @Delete('profilePic')
  deleteProfilePic(@GetUser('id') uid) {
    return this.userService.deleteProfileImage(uid);
  }

  @Get('profilePic')
  getProfilePicURL(@GetUser('profileURL') profileURL) {
    return { profileURL };
  }

  @Patch('profile')
  updateProfile(
    @Body(new ValidationPipe({ whitelist: true })) updateUserDto: UpdateUserDto,
    @GetUser() user: { [key: string]: string },
  ) {
    if (isEmptyObject(updateUserDto)) return user;
    return this.userService.updateProfile(user.id, updateUserDto);
  }

  @Delete('profile')
  deleteProfile(@GetUser('id') uid) {
    return this.userService.deleteProfile(uid);
  }

  @HttpCode(200)
  @Post('authors')
  fetchAuthors(
    @Body(new ValidationPipe({ whitelist: true }))
    fetchAuthorsDto: FetchAuthorsDto,
  ) {
    return this.userService.getAuthors(fetchAuthorsDto.authorIds);
  }

  @HttpCode(200)
  @Post('checkUsers')
  validateUsers(
    @Body(new ValidationPipe({ whitelist: true }))
    fetchAuthorsDto: FetchAuthorsDto,
  ) {
    return this.userService.checkIfUserExist(fetchAuthorsDto.authorIds);
  }
}
