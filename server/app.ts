import * as path from 'path';
import * as express from 'express';
import userRoutes from './routes/user';
import * as dotenv from 'dotenv';
import roomRoutes from './routes/rooms';
import * as cors from 'cors';

dotenv.config();
const app = express();

app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json());
app.use('/users', userRoutes);
app.use('/rooms', roomRoutes);

app.use('/', express.static(path.resolve(__dirname, '..', 'client', 'dist')));

app.listen(3000, 'localhost', () => {
  console.log('http://localhost:3000');
});
