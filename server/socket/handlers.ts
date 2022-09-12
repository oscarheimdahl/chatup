import { Socket } from 'socket.io';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '../../types/emits';

import { ChatMessage } from '../../types';
import chatroomDB from '../db/chatroom';
import chatMessageDB from '../db/message';
import userDB from '../db/user';
import { log, logChatMessage, logDisconnect } from '../logging/log';
import io, { connectedUsers } from './socket';
type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export const initHandlers = (socket: ChatSocket, username: string) => {
  socket.on('JOIN_ROOM_REQUEST', (room, token) => handleJoinRoomRequest(room, socket));
  socket.on('CHAT_MESSAGE', (chatMessage, token) => handleChatMessage(chatMessage, socket));
  socket.on('COLOR_CHOICE', (colorNum, token) => handleColorChoice(colorNum, socket));
  socket.on('disconnect', () => handleDisconnect(username, socket));
};

export const handleDisconnect = (username: string, socket: ChatSocket) => {
  connectedUsers.set(username, false);

  // socket.rooms.forEach((room) => {
  //   handleChatMessage(
  //     {
  //       message: `${username} leaved the room`,
  //       username: 'system',
  //       color: 1,
  //       room: room,
  //       sentDate: new Date(),
  //     },
  //     socket,
  //     false
  //   );
  // });

  logDisconnect(username);
};

export const handleChatMessage = (chatMessage: ChatMessage, socket: ChatSocket, log: boolean = true) => {
  socket.to(chatMessage.room).emit('CHAT_MESSAGE', chatMessage);
  chatMessageDB.create(chatMessage);
  if (log) logChatMessage(chatMessage);
};

export const handleJoinRoomRequest = async (room: string, socket: ChatSocket) => {
  if (!room || !socket.data.username) return;
  let preExisting = false;
  const user = await userDB.get(socket.data.username);
  if (!user) return;
  const { username, color } = user;
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

  if (preExisting) log(`${username} joined room ${room}`);
  else log(`${username} created room ${room}`);
};

export const handleColorChoice = (colorNum: number, socket: ChatSocket) => {
  const username = socket.data.username;
  if (!username) return;

  userDB.setColor(username, colorNum);
  log(`${username} changed color to ${colorNum}`);
};
