import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@src/../../types/emits';

export interface UserInitialState {
  loggedIn: boolean | null;
  token: string;
  username: string;
  room: '';
  color: number;
  loginError: {
    forbidden: boolean;
    serverUnreachable: boolean;
  };
  registerInfo: {
    usernameTaken: boolean;
    success: boolean;
  };
}

export interface SocketInitialState {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
}
