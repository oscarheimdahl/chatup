// export default {
//   INVALID_TOKEN: 'INVALID_TOKEN',
//   NEW_MESSAGE: 'NEW_MESSAGE',
//   JOIN_ROOM_REQUEST: 'JOIN_ROOM_REQUEST',
//   JOINED_ROOM: { key: 'JOINED_ROOM', data: { new: boolean } },
// };

export interface ServerToClientEvents {
  INVALID_TOKEN: () => void;
  NEW_MESSAGE: () => void;
  JOINED_ROOM: ({ old }: { old: boolean }) => void;
}

export interface ClientToServerEvents {
  JOIN_ROOM_REQUEST: (room: string, token: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  username: string;
}
