import * as express from 'express';
import { initDB } from './db/tables';
import userRoutes from './routes/user';

const app = express();

initDB();

app.use('/users', userRoutes);

app.listen(3000, 'localhost', () => {
  console.log('localhost:3000');
});
