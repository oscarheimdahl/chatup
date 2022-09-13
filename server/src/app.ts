import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as path from 'path';
import chatroomRoutes from './routes/chatroom';
import io from './socket/socket';
import userRoutes from './routes/user';
import adminRoutes from './routes/admin';

const app = express();
const origin = 'http://localhost:8080';

app.use(cors({ origin }));
app.use(express.json());

app.use('/user', userRoutes);
app.use('/chatroom', chatroomRoutes);
app.use('/admin', adminRoutes);

app.use('/', express.static(path.resolve(__dirname, '..', '..', 'client', 'dist')));

app.get('*', (req, res) => {
  res.status(404).sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const server = app.listen(3000, () => {
  console.log('http://localhost:3000');
});

io.listen(server, { cors: { origin } });
