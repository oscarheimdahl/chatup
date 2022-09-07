import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as path from 'path';
import roomRoutes from './routes/chatroom';
import io from './routes/socket';
import userRoutes from './routes/user';

const app = express();
const origin = '*';

app.use(cors({ origin }));
app.use(express.json());

app.use('/users', userRoutes);
app.use('/rooms', roomRoutes);

app.use('/', express.static(path.resolve(__dirname, '..', 'client', 'dist')));

// app.get('*', (req, res) => {
//   res.status(404).send('what???');
// });

const server = app.listen(3000, () => {
  console.log('http://localhost:3000');
});

io.listen(server, { cors: { origin } });
