import * as express from 'express';
import userRoutes from './routes/user';
import * as dotenv from 'dotenv';
import roomRoutes from './routes/rooms';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/rooms', roomRoutes);

app.listen(3000, 'localhost', () => {
  console.log('http://localhost:3000');
});
