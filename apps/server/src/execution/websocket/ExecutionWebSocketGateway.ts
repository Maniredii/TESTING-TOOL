import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ExecutionEventEmitter } from '../events/ExecutionEventEmitter';

export class ExecutionWebSocketGateway {
  private io: Server;

  constructor(server: HttpServer, private eventEmitter: ExecutionEventEmitter) {
    this.io = new Server(server, {
      cors: { origin: '*' }
    });

    this.setupListeners();
    this.setupEmitterBindings();
  }

  private setupListeners() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);
      
      socket.on('subscribe_execution', (executionId: string) => {
        socket.join(`execution_${executionId}`);
      });

      socket.on('unsubscribe_execution', (executionId: string) => {
        socket.leave(`execution_${executionId}`);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  private setupEmitterBindings() {
    this.eventEmitter.on('ws_event', (event) => {
      const { type, payload } = event;
      if (payload && payload.executionId) {
        // Broadcast to clients subscribed to this execution
        this.io.to(`execution_${payload.executionId}`).emit(type, payload);
      } else {
        // Global broadcast if no specific executionId
        this.io.emit(type, payload);
      }
    });
  }
}
