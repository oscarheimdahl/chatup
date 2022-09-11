import { Socket } from 'socket.io';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '../../types/emits';

import { ChatMessage } from '../../types';
import { createChatroom, getChatroom, joinChatRoom } from '../db/chatroom';
import { createChatMessage } from '../db/message';
import { log, logChatMessage, logDisconnect } from '../logging/log';
import { connectedUsers } from './socket';
type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export const handleDisconnect = (username: string) => {
  connectedUsers.set(username, false);
  logDisconnect(username);
};

export const handleChatMessage = (chatMessage: ChatMessage, socket: ChatSocket) => {
  socket.to(chatMessage.room).emit('CHAT_MESSAGE', chatMessage);

  logChatMessage(chatMessage);

  createChatMessage(chatMessage);
};

export const handleJoinRoomRequest = async (room: string, socket: ChatSocket) => {
  if (!room) return;
  let preExisting = false;
  const username = socket.data.username;
  if (!username) return;

  let chatroom = await getChatroom(room);
  if (chatroom) preExisting = true;
  else chatroom = await createChatroom(room);
  if (chatroom === null) return;

  await joinChatRoom(chatroom.id, username);

  socket.emit('JOINED_ROOM', { room, preExisting });
  log(`${socket.data.username} joined room ${room}`);
  socket.join(room);
};
