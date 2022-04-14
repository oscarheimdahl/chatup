import { Server } from 'socket.io';
import { decodeToken, verifyToken } from '../db/token';

const io = new Server();
// io.listen(3001, { cors: { origin: 'null' } });

io.use(async (socket, next) => {
  let handshake = socket.handshake;
  try {
    // const ok = await verifyToken(handshake.auth.token);
    const ok = await decodeToken(handshake.auth.token);
    console.log(ok);
    // if (ok) next();
  } catch (e) {
    console.log(e);
    return;
  }
  next();
});

io.on('connection', (socket) => {
  console.log('connection');
  socket.on('message', handleMessage);
});

interface ChatMessage {
  room: string;
  message: string;
}

const handleMessage = (data: ChatMessage) => {
  const { room, message } = data;
  io.in(room);
  io.emit(message);
};

export default io;
