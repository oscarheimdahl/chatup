import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '../../types/emits';
import { createChatroom, getChatroom, joinChatRoom } from '../db/chatroom';
import { decodeToken } from '../db/token';

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
  console.log('new connection');
  socket.on('JOIN_ROOM_REQUEST', (room, token) => handleJoinRoomRequest(room, socket));
  socket.on('CHAT_MESSAGE', (message, token) => handleChatMessage(message, socket));
});

const handleChatMessage = (message: string, socket: ChatSocket) => {
  console.log('chatmessage recieved');
  socket.broadcast.emit('CHAT_MESSAGE', message, socket.data.username ?? 'unkown');
};

const handleJoinRoomRequest = async (room: string, socket: ChatSocket) => {
  let oldRoom = false;
  const username = socket.data.username;
  if (!username) return;

  let chatroom = await getChatroom(room);
  if (chatroom) oldRoom = true;
  else chatroom = await createChatroom(room);
  if (chatroom === null) return;

  await joinChatRoom(chatroom.id, username);

  console.log(`${socket.data.username} joined room ${room}, old room: ${oldRoom}`);
  socket.emit('JOINED_ROOM', { old: oldRoom, room });
};

export default io;
