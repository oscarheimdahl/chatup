import { ChatMessage } from './message';

export interface ServerToClientEvents {
  INVALID_TOKEN: () => void;
  CHAT_MESSAGE: (chatMessage: ChatMessage) => void;
  JOINED_ROOM: ({ preExisting, room }: { preExisting: boolean; room: string }) => void;
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
