import { ChatMessage } from './message';

export interface RoomJoinResponse {
  preExisting: boolean;
  room: string;
}

export interface ServerToClientEvents {
  INVALID_TOKEN: () => void;
  CHAT_MESSAGE: (chatMessage: ChatMessage) => void;
  JOINED_ROOM: ({ preExisting, room }: RoomJoinResponse) => void;
  OTHER_JOINED_ROOM: (user: User) => void;
}

export interface ClientToServerEvents {
  JOIN_ROOM_REQUEST: (room: string, token: string) => void;
  CHAT_MESSAGE: (chatMessage: ChatMessage, token: string) => void;
  COLOR_CHOICE: (colorNum: number, token: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  username: string;
}
