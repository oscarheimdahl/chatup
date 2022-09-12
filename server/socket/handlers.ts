import { Socket } from 'socket.io';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '../../types/emits';

import { ChatMessage } from '../../types';
import chatroomDB from '../db/chatroom';
import chatMessageDB from '../db/message';
import userDB from '../db/user';
import { log, logChatMessage, logDisconnect } from '../logging/log';
import { connectedUsers } from './socket';
type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export const initHandlers = (socket: ChatSocket, username: string) => {
  socket.on('JOIN_ROOM_REQUEST', (room, token) => handleJoinRoomRequest(room, socket));
  socket.on('CHAT_MESSAGE', (chatMessage, token) => handleChatMessage(chatMessage, socket));
  socket.on('COLOR_CHOICE', (colorNum, token) => handleColorChoice(colorNum, socket));
  socket.on('disconnect', () => handleDisconnect(username));
};

export const handleDisconnect = (username: string) => {
  connectedUsers.set(username, false);
  logDisconnect(username);
};

export const handleChatMessage = (chatMessage: ChatMessage, socket: ChatSocket) => {
  socket.to(chatMessage.room).emit('CHAT_MESSAGE', chatMessage);
  chatMessageDB.create(chatMessage);
  logChatMessage(chatMessage);
};

export const handleJoinRoomRequest = async (room: string, socket: ChatSocket) => {
  if (!room) return;
  let preExisting = false;
  const username = socket.data.username;
  if (!username) return;

  let chatroom = await chatroomDB.get(room);
  if (chatroom) preExisting = true;
  else chatroom = await chatroomDB.create(room);

  if (chatroom === null) return;

  await chatroomDB.join(chatroom.id, username);

  socket.emit('JOINED_ROOM', { room, preExisting });
  socket.join(room);

  if (preExisting) log(`${socket.data.username} joined room ${room}`);
  else log(`${socket.data.username} created room ${room}`);
};

export const handleColorChoice = (colorNum: number, socket: ChatSocket) => {
  const username = socket.data.username;
  if (!username) return;

  userDB.setColor(username, colorNum);
  log(`${username} changed color to ${colorNum}`);
};
