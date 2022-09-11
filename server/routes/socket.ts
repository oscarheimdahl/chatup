import { Server, Socket } from 'socket.io';
import { ChatMessage } from '../../types';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '../../types/emits';
import { createChatroom, getChatroom, joinChatRoom } from '../db/chatroom';
import { createChatMessage } from '../db/message';
import { decodeToken } from '../db/token';
import { log, logChatMessage, logDisconnect } from '../logging/log';

export const connectedUsers = new Map<string, boolean>();
export const USERNAME_MISSING = 'username_missing';
type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

io.use(async (socket, next) => {
  let handshake = socket.handshake;
  try {
    const decodedToken = await decodeToken(handshake.auth.token);
    if (!decodedToken) return socket.emit('INVALID_TOKEN');
    if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
      return socket.emit('INVALID_TOKEN');
    }
    socket.data.username = decodedToken.username;
    next();
  } catch (e) {
    console.log('EXPIRED');
    return;
  }
});

io.on('connection', (socket) => {
  const username = socket.data.username ?? USERNAME_MISSING;
  if (connectedUsers.get(username)) return socket.disconnect();
  connectedUsers.set(username, true);
  log(`${username} connected! SocketID ${socket.id}`);

  socket.on('JOIN_ROOM_REQUEST', (room, token) => handleJoinRoomRequest(room, socket));
  socket.on('CHAT_MESSAGE', (chatMessage, token) => handleChatMessage(chatMessage, socket));
  socket.on('disconnect', () => onSocketDisconnect(username));
});

const onSocketDisconnect = (username: string) => {
  connectedUsers.set(username, false);
  logDisconnect(username);
};

const handleChatMessage = (chatMessage: ChatMessage, socket: ChatSocket) => {
  socket.to(chatMessage.room).emit('CHAT_MESSAGE', chatMessage);

  logChatMessage(chatMessage);

  createChatMessage(chatMessage);
};

const handleJoinRoomRequest = async (room: string, socket: ChatSocket) => {
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

export default io;
