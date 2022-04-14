import * as express from 'express';
import { createChatroom } from '../db/chatroom';
import { authMiddleware } from '../middleware/auth';

const roomRoutes = express.Router();

roomRoutes.use(authMiddleware);

roomRoutes.get('/', async (req, res) => {});

roomRoutes.post('/join', async (req, res) => {
  const { name } = req.body;
  const errMessage = validateName(name);

  if (errMessage) {
    return res.status(400).send(errMessage);
  }

  try {
    const oldChatroomErr = await createChatroom(name);
    if (oldChatroomErr) {
      return res.status(409).send(oldChatroomErr);
    }
  } catch (e) {
    return res.status(500).end();
  }

  return res.status(201).end();
});

const validateName = (name: string) => {
  if (!name) return 'Name missing!';
  if (name.length < 4) return 'Name must be longer than 4';
};

export default roomRoutes;
