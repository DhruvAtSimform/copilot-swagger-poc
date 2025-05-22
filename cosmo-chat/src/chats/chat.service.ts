import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { CosmoChatGateway } from 'src/chats/gateways/cosmo-chat.gateway';
import {
  ChatGroup,
  ChatGroupDocument,
} from 'src/database/schemas/chatGroup.schema';
import { Message, MessageDocument } from 'src/database/schemas/message.schema';
import { ErrorMessageGenerator } from 'src/utils/index.util';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import {
  AddMembersDto,
  CreateChatGroupDto,
  GetMessageQueryDto,
  RemoveMemberDto,
  SendMessageDto,
  UpdateChatGroupDto,
} from './dtos';

type axiosUserValidateResponse = Promise<[string[], { error: any }]>;

// making full grown chat application with sockets is not that simple. Specifically a scalling sockets. it's not an impossible though.
// with adapter and other tools we can do that.

@Injectable()
export class ChatService {
  constructor(
    @Inject(forwardRef(() => CosmoChatGateway))
    private readonly chatServer: CosmoChatGateway,
    @InjectModel(ChatGroup.name) private ChatGroup: Model<ChatGroupDocument>,
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Message.name) private ChatMessage: Model<MessageDocument>,
    private readonly httpService: HttpService,
  ) {}

  async getMyRooms(uid: string) {
    try {
      const groups = await this.ChatGroup.find({ members: uid }, { _id: 1 });
      return groups.map((g) => g._id.toHexString());
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getMyChatGroups(uid: string) {
    try {
      const chatGroups = await this.ChatGroup.find({ members: uid });
      return chatGroups;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        ErrorMessageGenerator(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createNewChatGroup(
    createChatGroupDto: CreateChatGroupDto,
    adminId: string,
    jwt: string,
    filePath?: string,
  ) {
    try {
      let members = [...new Set(createChatGroupDto.members)];
      members = members.filter((m) => m !== adminId);
      if (members.length < 1) {
        throw new BadRequestException(
          'A group must have atleast one valid member',
        );
      }

      const [data, error] = await this.validateAndReturnUsers(members, jwt);

      if (error) {
        throw new UnprocessableEntityException(error);
      }

      if (data.length < 1) {
        throw new BadRequestException(
          'There must be an at least one memeber to create Chat Group.',
        );
      }

      const chatGroup = new this.ChatGroup({
        ...createChatGroupDto,
        members: data,
        adminId: adminId,
      });

      if (filePath) {
        const response: UploadApiResponse | UploadApiErrorResponse =
          await this.cloudinaryService.uploadImage(
            filePath,
            chatGroup._id.toHexString(),
          );
        if (!response)
          throw new Error(
            response.http_code
              ? response.message
              : 'unable to update image, please try later',
          );
        chatGroup.profileImg = response.secure_url;
      }
      await chatGroup.save();
      chatGroup.members.forEach((member) => {
        this.chatServer.serverIO
          .in(member)
          .socketsJoin(chatGroup._id.toHexString());
        this.chatServer.serverIO
          .to(member)
          .emit('group created', { chatGroup });
      });
      return chatGroup;
    } catch (error) {
      console.log(error?.response?.data);
      throw new HttpException(
        ErrorMessageGenerator(error),
        error?.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  validateAndReturnUsers(
    members: string[],
    jwt: string,
  ): axiosUserValidateResponse {
    return new Promise((resolve, reject) => {
      firstValueFrom(
        this.httpService.post(
          '/checkUsers',
          { authorIds: members },
          {
            headers: { Authorization: jwt },
          },
        ),
      )
        .then((res) => {
          resolve([res.data, undefined]);
        })
        .catch((err) => {
          if (err.message) reject([undefined, { error: err.message }]);
          reject([undefined, { error: err.response.data }]);
        });
    });
  }

  async updateChatGroup(
    updateChatGroupDto: UpdateChatGroupDto,
    userId: string,
    filePath?: string,
  ) {
    try {
      const chatGroup = await this.ChatGroup.findOne({
        _id: updateChatGroupDto.chatGroupId,
        adminId: userId,
      });
      if (!chatGroup) {
        throw new BadRequestException(`No ChatGroup to Update`);
      }
      if (!updateChatGroupDto.name) {
        return chatGroup;
      }
      if (filePath) {
        const response: UploadApiResponse | UploadApiErrorResponse =
          await this.cloudinaryService.uploadImage(
            filePath,
            chatGroup._id.toHexString(),
          );
        if (!response)
          throw new Error(
            response.http_code
              ? response.message
              : 'unable to update image, please try later',
          );
        chatGroup.profileImg = response.secure_url;
      }
      chatGroup.name = updateChatGroupDto.name;
      await chatGroup.save();
      return chatGroup;
    } catch (error) {
      throw new HttpException(
        ErrorMessageGenerator(error),
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteChatGroup(grpId: string, uid: string) {
    try {
      const response = await this.ChatGroup.deleteOne({
        _id: grpId,
        adminId: uid,
      });
      if (response.deletedCount < 1) {
        throw new BadRequestException({
          message: 'Can not Delete Chat Group, Bad Input',
        });
      }
      await this.cloudinaryService.deleteImage(uid);
      this.chatServer.serverIO.in(grpId).emit('Group deleted', { grpId });
      this.chatServer.serverIO.socketsLeave(grpId);
      return { deleted: true };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        ErrorMessageGenerator(error),
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addMembers(addMembersDto: AddMembersDto, uid: string, jwt: string) {
    try {
      const chatGroup = await this.ChatGroup.findOne(
        {
          _id: addMembersDto.chatGroupId,
          adminId: uid,
        },
        { _id: 1 },
      );
      // console.log(chatGroup);

      if (!chatGroup) {
        throw new BadRequestException(
          'You cannot add members to this Group, Bad Request',
        );
      }

      let members = [...new Set(addMembersDto.members)];
      members = members.filter((m) => m !== uid);
      if (members.length < 1) {
        throw new BadRequestException(
          'A group must have am atleast one valid member',
        );
      }

      const [data, error] = await this.validateAndReturnUsers(members, jwt);

      if (error) {
        throw new UnprocessableEntityException(error);
      }

      if (data.length < 1) {
        throw new BadRequestException(
          'There must be an atleast one memeber to create Chat Group.',
        );
      }

      const group = await this.ChatGroup.findOneAndUpdate(
        { _id: addMembersDto.chatGroupId, adminId: uid },
        //@ts-ignore
        { $addToSet: { members: data } },
        { new: true },
      );
      members.forEach((member) => {
        this.chatServer.serverIO
          .in(member)
          .socketsJoin(chatGroup._id.toHexString());
        this.chatServer.serverIO.in(member).emit('member added', { chatGroup });
      });
      return group;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        ErrorMessageGenerator(error),
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeMember(removeMemberDto: RemoveMemberDto, uid: string) {
    try {
      if (removeMemberDto.memberId === uid) {
        throw new BadRequestException(
          'You can not remove yourself, try delete and leave chatGroup',
        );
      }

      const chatGroup = await this.ChatGroup.findOne({
        _id: removeMemberDto.chatGroupId,
        adminId: uid,
        members: { $elemMatch: { $eq: removeMemberDto.memberId } },
      });

      if (!chatGroup) {
        throw new BadRequestException(
          'You cannot remove members from this Group, Bad Request',
        );
      }
      chatGroup.members = chatGroup.members.filter(
        (mem) => mem !== removeMemberDto.memberId,
      );
      await chatGroup.save();
      this.chatServer.serverIO
        .to(removeMemberDto.memberId)
        .emit('Member removed', { grpId: chatGroup._id.toHexString() });
      this.chatServer.serverIO
        .in(removeMemberDto.memberId)
        .socketsLeave(chatGroup._id.toHexString());
      return chatGroup;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        ErrorMessageGenerator(error),
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async SendMessage(sendMessageDto: SendMessageDto, uid: string) {
    try {
      const grp = await this.ChatGroup.findOne(
        {
          _id: sendMessageDto.chatGroupId,
          members: { $elemMatch: { $eq: uid } },
        },
        { _id: 1 },
      );
      if (!grp) {
        throw new BadRequestException('You cannot send messages to This Group');
      }

      const message = await this.ChatMessage.create({
        ...sendMessageDto,
        userId: uid,
      });

      this.chatServer.serverIO
        .in(grp._id.toHexString())
        .except(uid)
        .emit('broadcast', message);

      return message;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        ErrorMessageGenerator(error),
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMessages(
    { chatGroupId, skip, limit }: GetMessageQueryDto,
    uid: string,
  ) {
    try {
      const grp = await this.ChatGroup.findOne({
        _id: chatGroupId,
        members: uid,
      });
      if (!grp) {
        throw new BadRequestException('You cannot send messages to This Group');
      }

      return await this.ChatMessage.find({ chatGroupId: grp._id }, null, {
        skip: skip ? skip : 0,
        limit: limit ? limit : 30,
        sort: { createdAt: -1 },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        ErrorMessageGenerator(error),
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
