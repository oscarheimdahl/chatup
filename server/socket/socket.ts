import { Server } from 'socket.io';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '../../types/emits';
import { decodeToken } from '../db/token';
import { log } from '../logging/log';
import { initHandlers } from './handlers';

export const connectedUsers = new Map<string, boolean>();
export const USERNAME_MISSING = 'username_missing';
export const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

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

  initHandlers(socket, username);
});

export default io;
