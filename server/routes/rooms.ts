import * as express from 'express';
import { Server } from 'socket.io';
import { authMiddleware } from '../middleware/auth';

const roomRoutes = express.Router();

roomRoutes.use(authMiddleware);

const io = new Server();
io.listen(3001, { cors: { origin: 'null' } });

io.use((socket, next) => {
  let handshake = socket.handshake;
  console.log(handshake);

  if (handshake.auth.token != 'banana') return;

  next();
});

io.on('connection', (socket) => {
  console.log('first');

  socket.on('banana', (data) => {
    console.log('MESSAGE HERE 🔴');
  });
});

roomRoutes.get('/', async (req, res) => {});

export default roomRoutes;
