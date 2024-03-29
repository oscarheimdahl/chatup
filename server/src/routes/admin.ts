import * as express from 'express';
import * as path from 'path';
import { authMiddleware } from '../middleware/auth';

const adminRoutes = express.Router();

adminRoutes.use(authMiddleware);

adminRoutes.get('/logs', async (req, res) => {
  const username = res.locals.username;
  if (!username || username !== process.env.ADMIN) {
    res.status(404).end();
    return;
  }
  res.status(200).sendFile(path.resolve(__dirname, '..', 'logging', 'logs.log'));
});

export default adminRoutes;
