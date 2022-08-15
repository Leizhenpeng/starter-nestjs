import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';

const PORT = parseInt(process.env.SOCKET_PORT || '3001', 10);

@WebSocketGateway(PORT, {
  //https://socket.io/docs/v4/handling-cors/
  cors: {
    origin: ['http://localhost:8080'],
    credentials: true,
  },
  allowEIO3: true,
  path: '/',
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger(SocketGateway.name);
  // constructor(private readonly logger: PinoLogger) {
  //   // Optionally you can set context for logger in constructor or ...
  //   this.logger.setContext(SocketGateway.name);
  // }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  afterInit(server: Server) {
    this.logger.log(`Socket.io server listening on port ${PORT}`);
    this.logger.log(`Socket.io server listening on path ${server.path()}`);
  }

  handleDisconnect(client: Socket) {
    //include this socket client ready to quit ,equal below plus 1
    // this.logger.log(this.server.engine.clientsCount);
    //exclude the socket client ready to quit
    this.logger.log(
      `Client disconnected (LEFT:${this.server.sockets.sockets.size}): ${client.id}`,
    );
    this.logger.log(
      `Client disconnected (LEFT:${this.server.sockets.sockets.size}): ${client.id}`,
    );
  }

  // every new client connect will hook
  handleConnection(client: Socket) {
    //before handleDisconnect
    client.on('disconnect', (reason) => {
      this.logger.warn(`disconnect reason :  ${reason}`);
    });

    this.logger.log(
      `Client connected (ALL:${this.server.sockets.sockets.size}): ${client.id}`,
    );
  }
}
