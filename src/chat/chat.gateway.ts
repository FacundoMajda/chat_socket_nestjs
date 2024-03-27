import {
  MessageBody,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  SubscribeMessage,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}

  onModuleInit() {
    this.server.on('connect', (socket) => {
      const { name, token } = socket.handshake.auth;

      if (!name) {
        socket.disconnect();
        return;
      }

      this.chatService.onClientConnected({ id: socket.id, name: name });

      console.log({ name, token });

      socket.emit('welcome', 'Bienvenido al servidor');

      this.server.emit('on-clients-changed', this.chatService.getClients());

      socket.on('disconnect', () => {
        this.chatService.onClientDisconnected(socket.id);
      });
    });
  }

  // Esta función se ejecuta cuando se recibe un mensaje del cliente
  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { name } = client.handshake.auth;
    console.log(name, message);

    if (!message) {
      return;
    }

    this.server.emit('message', {
      userId: client.id,
      message: message,
      name: name,
    });
  }
}
