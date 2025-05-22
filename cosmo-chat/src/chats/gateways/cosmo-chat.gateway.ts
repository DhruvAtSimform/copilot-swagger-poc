import { forwardRef, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat.service';

@WebSocketGateway({ cors: { origin: '*' }, path: '/cosmoChat' })
export class CosmoChatGateway implements OnGatewayInit, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit(io: Server) {
    io.use(async (socket, next) => {
      const token = socket?.handshake?.auth?.token as string;
      if (!token) {
        return next(new Error('Authentication failed, please provide a token'));
      }
      const t = token.replace('Bearer ', '');
      try {
        const user = this.jwtService.verify(t);

        if (user) {
          socket['user'] = user;
          const rooms = await this.chatService.getMyRooms(user['id']);
          // console.log({ count: this.count, rooms, ...user });
          if (!rooms) {
            return next(new Error('Interal Error, can not use chat service'));
          }
          await socket.join(rooms);
          await socket.join(user._id);
          rooms.forEach((room) => {
            socket
              .to(room)
              .emit(
                'active',
                this.serverIO.sockets.adapter.rooms.get(room)?.size,
              );
          });
          return next();
        }
      } catch (error) {
        console.log(error);
        return next(new Error('Authentication failed!'));
      }
    });
  }

  async handleDisconnect(client: Socket) {
    // console.log(client['user']);
    const user = client['user'];
    const rooms = await this.chatService.getMyRooms(user['id']);
    rooms.forEach((room) => {
      client
        .to(room)
        .emit(
          'active',
          this.serverIO.sockets.adapter.rooms.get(room)?.size - 1,
        );
    });
  }

  @WebSocketServer()
  public readonly serverIO: Server;

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   console.log({ rooms: client.rooms });
  //   this.serverIO.to('6304bbf0829bb2e446be5e64').emit('message', payload);
  //   return 'Hello world!';
  // }

  @SubscribeMessage('active') // gives you active users in certain group
  countActiveUsers(
    @MessageBody() data: { grpId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.emit(
      'active',
      this.serverIO.sockets.adapter.rooms.get(data.grpId).size,
    );
    // this.serverIO.emit('broadcast', 'bla bla data');
  }
  @SubscribeMessage('typing') // gives you active users in certain group
  userIsTyping(
    @MessageBody() data: { grpId: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('started typing');
    client.to(data.grpId).emit('typing', data);
  }

  @SubscribeMessage('stopped typing') // gives you active users in certain group
  userStoppedTyping(
    @MessageBody() data: { grpId: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('stopped typing');
    client.to(data.grpId).emit('stopped typing', data);
  }
}

/* 
going ahead with only websockets for creating data, or sending messages, retrival can not be implemented that easily. Maitain security
, pipelines, guards etc become more tedious.

Other option is use CRUD for this approach and just broadcast the information using socket in case of successful CRUD operations. */

/* 
 Events emitted by Service to Client:
  1. Broadcast - sending message to group
  2. Group Created - sending group create notification to currently connected people/members.
  3. Members added - sending notifications to newly connected members on his/her uid-room.
  4. Group deleted - send request to remove the data of deleted group and make sure all memebers left the room.
  5. Member removed - idk what to do in this case.... your data is going to removed completely. The better approch would be you have access to see your old messages.
                      that will me much more tedious and hard to achieve.
*/
