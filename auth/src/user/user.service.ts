import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly prismaService: PrismaService,
    @Inject('POST_SERVICE') private readonly postClient: ClientProxy,
  ) {}

  async uploadProfile(filePath: string, uid: string) {
    try {
      const result = await this.cloudinaryService.uploadImage(filePath, uid);
      console.log(result);
      const res = await this.prismaService.user.update({
        select: { profileURL: true },
        data: { profileURL: result.secure_url as string },
        where: { id: uid },
      });
      console.log(res);
      return res;
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteProfileImage(uid: string) {
    try {
      const res = await this.cloudinaryService.deleteImage(uid);
      console.log({ res });

      if (res.result && res.result === 'ok') {
        const update = await this.prismaService.user.update({
          select: { profileURL: true },
          data: { profileURL: null },
          where: { id: uid },
        });
        if (update) {
          return { profileURL: update.profileURL };
        }
      } else {
        throw new Error(res.result);
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateProfile(uid: string, profile: UpdateUserDto) {
    try {
      const res = await this.prismaService.user.update({
        select: { email: true, id: true, bio: true, age: true, name: true },
        data: { ...profile },
        where: { id: uid },
      });
      if (res) {
        return { user: res };
      } else {
        throw new Error(
          'something went wqrong while updating profile, please try later',
        );
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteProfile(id: string) {
    try {
      const res = await this.prismaService.user.delete({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          age: true,
          bio: true,
          updatedAt: true,
        },
      });
      await this.cloudinaryService.deleteImage(id);

      this.postClient.emit('user_deleted', { uid: id });
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAuthors(authorIds: string[]) {
    if (authorIds.length < 1) {
      return [];
    }
    try {
      const authors = await this.prismaService.user.findMany({
        where: { id: { in: authorIds } },
        select: { id: true, name: true, bio: true },
        take: 10,
      });
      return authors;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async checkIfUserExist(userIds: string[]) {
    try {
      const users = await this.prismaService.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true },
      });
      return users.map((user) => user.id);
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, Internal Error',
      );
    }
  }
}
