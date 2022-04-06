import * as express from 'express';
import { authMiddleware } from '../middleware/auth';

const roomRoutes = express.Router();

roomRoutes.use(authMiddleware);

roomRoutes.get('/', async (req, res) => {
  res.end();
});

export default roomRoutes;
