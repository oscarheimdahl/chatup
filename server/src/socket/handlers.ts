import { Socket } from 'socket.io';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '../../../types/emits';

import { ChatMessage } from '../../../types';
import chatroomDB from '../db/chatroom';
import chatMessageDB from '../db/message';
import userDB from '../db/user';
import { log, logChatMessage, logDisconnect } from '../logging/log';
import io, { connectedUsers, socketRooms } from './socket';
type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export const initHandlers = (socket: ChatSocket, username: string) => {
  socket.on('JOIN_ROOM_REQUEST', (room) => handleJoinRoomRequest(username, room, socket));
  socket.on('CHAT_MESSAGE', (chatMessage) => handleChatMessage(chatMessage, socket));
  socket.on('COLOR_CHOICE', (colorNum) => handleColorChoice(username, colorNum));
  socket.on('LEAVE_ROOM', () => handleLeaveRoom(username, socket));
  socket.on('disconnect', () => handleDisconnect(username, socket));
};

export const handleDisconnect = (username: string, socket: ChatSocket) => {
  connectedUsers.set(username, false);
  leaveRoom(username, socket);

  logDisconnect(username);
};

export const handleChatMessage = (chatMessage: ChatMessage, socket: ChatSocket, log: boolean = true) => {
  socket.broadcast.to(chatMessage.room).emit('CHAT_MESSAGE', chatMessage);
  chatMessageDB.create(chatMessage);
  if (log) logChatMessage(chatMessage);
};

export const handleJoinRoomRequest = async (username: string, room: string, socket: ChatSocket) => {
  if (!room) return;
  let preExisting = false;
  const user = await userDB.get(username);
  if (!user) return;
  const { color } = user;
  let chatroom = await chatroomDB.get(room);
  if (chatroom) preExisting = true;
  else chatroom = await chatroomDB.create(room);

  if (chatroom === null) return;

  await chatroomDB.join(chatroom.id, username);

  socket.emit('JOINED_ROOM', { room, preExisting });
  socket.join(room);
  socket.broadcast.to(room).emit('OTHER_JOINED_ROOM', { username, color });
  handleChatMessage(
    {
      message: `${username} joined the room`,
      username: 'system',
      color: 1,
      room: room,
      sentDate: new Date(),
    },
    socket,
    false
  );

  // const oldRoom = socketRooms.get(username);
  // if (oldRoom) socket.leave(oldRoom);
  socketRooms.set(username, room);

  if (preExisting) log(`${username} joined room ${room}`);
  else log(`${username} created room ${room}`);
};

export const handleColorChoice = (username: string, colorNum: number) => {
  if (!username) return;

  userDB.setColor(username, colorNum);
  log(`${username} changed color to ${colorNum}`);
};

export const handleLeaveRoom = (username: string, socket: ChatSocket) => {
  leaveRoom(username, socket);
};

const leaveRoom = (username: string, socket: ChatSocket) => {
  const room = socketRooms.get(username);
  if (!room) return;
  socketRooms.delete(username);

  handleChatMessage(
    {
      message: `${username} left the room`,
      username: 'system',
      color: 1,
      room: room,
      sentDate: new Date(),
    },
    socket,
    false
  );

  log(`${username} left room ${room}`);
};
