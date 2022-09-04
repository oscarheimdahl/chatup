import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '../../types/emits';
import { createChatroom, getChatroom } from '../db/chatroom';
import { decodeToken } from '../db/token';

type MySocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
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
});

const handleJoinRoomRequest = async (room: string, socket: MySocket) => {
  console.log(socket.id);
  let oldRoom = false;
  const previousChatroom = await getChatroom(room);
  if (previousChatroom) oldRoom = true;
  else await createChatroom(room);

  console.log(`${socket.data.username} joined room ${room}, old room: ${oldRoom}`);
  socket.emit('JOINED_ROOM', { old: oldRoom });
};

export default io;
