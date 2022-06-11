import { Server, Socket } from 'socket.io';
import { ChatMessage } from '../../types';
import emits from '../../types/emits';
import { decodeToken, verifyToken } from '../db/token';

const io = new Server();
// io.listen(3001, { cors: { origin: 'null' } });

io.use(async (socket, next) => {
  let handshake = socket.handshake;
  console.log('first');
  try {
    const ok = verifyToken(handshake.auth.token);
    if (ok) next();
    else return socket.emit('invalid-token');
  } catch (e) {
    console.log('Error verifying token');
    socket.emit('500');
    return;
  }
});

io.on('connection', (socket) => {
  socket.on('message', (data) => handleMessage(socket, data));
});

const handleMessage = async (socket: Socket, data: ChatMessage) => {
  const { room, message, token } = data;
  const ok = verifyToken(token);
  const tokenData = await decodeToken(token);
  if (!ok) return socket.emit(emits.INVALID_TOKEN);

  console.log(`${tokenData!.username} says: "${message}" in room: "${room}"`);
};

export default io;
