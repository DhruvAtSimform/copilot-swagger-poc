import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Headers,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { GetUser } from 'src/decorator';
import { ChatService } from './chat.service';
import {
  AddMembersDto,
  CreateChatGroupDto,
  DeleteParamDto,
  GetMessageQueryDto,
  RemoveMemberDto,
  SendMessageDto,
  UpdateChatGroupDto,
} from './dtos';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('myGroups')
  getMyChatGroups(@GetUser('id') uid: string) {
    return this.chatService.getMyChatGroups(uid);
  }

  @Post('createGroup')
  @UseInterceptors(
    FileInterceptor('profileImg', {
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
  createChatGroup(
    @Body(new ValidationPipe({ whitelist: true }))
    createChatGroupDto: CreateChatGroupDto,
    @GetUser('id') uid: string,
    @Headers('Authorization') jwt: string,
    @UploadedFile()
    file?: any,
  ) {
    return this.chatService.createNewChatGroup(
      createChatGroupDto,
      uid,
      jwt,
      file?.path,
    );
  }

  @Patch('chatGroup')
  @UseInterceptors(
    FileInterceptor('profileImg', {
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
  updateChatGroup(
    @Body(new ValidationPipe({ whitelist: true }))
    updateChatGroupDto: UpdateChatGroupDto,
    @GetUser('id') uid: string,
    @UploadedFile() file?: any,
  ) {
    return this.chatService.updateChatGroup(
      updateChatGroupDto,
      uid,
      file?.path,
    );
  }

  @Delete('chatGroup/:id')
  deleteChatGroup(
    @Param(new ValidationPipe({ whitelist: true }))
    deleteChatGroupDto: DeleteParamDto,
    @GetUser('id') uid: string,
  ) {
    return this.chatService.deleteChatGroup(deleteChatGroupDto.id, uid);
  }

  @Patch('addMembers')
  addMemebersToGroup(
    @Body(new ValidationPipe({ whitelist: true })) addMembersDto: AddMembersDto,
    @GetUser('id') uid: string,
    @Headers('Authorization') jwt: string,
  ) {
    return this.chatService.addMembers(addMembersDto, uid, jwt);
  }

  @Patch('removeMember')
  removeMemeberFromGroup(
    @Body(new ValidationPipe({ whitelist: true }))
    removeMemberDto: RemoveMemberDto,
    @GetUser('id') uid: string,
  ) {
    return this.chatService.removeMember(removeMemberDto, uid);
  }

  @Post('message')
  sendMessage(
    @Body(new ValidationPipe({ whitelist: true }))
    sendMessageDto: SendMessageDto,
    @GetUser('id') uid: string,
  ) {
    return this.chatService.SendMessage(sendMessageDto, uid);
  }

  @Get('messages')
  getMessages(
    @Query(new ValidationPipe({ whitelist: true }))
    getMessageQueryDto: GetMessageQueryDto,
    @GetUser('id') uid: string,
  ) {
    return this.chatService.getMessages(getMessageQueryDto, uid);
  }
}
