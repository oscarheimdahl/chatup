import * as express from 'express';
import chatroomDB from '../db/chatroom';
import chatMessageDB from '../db/message';
import userDB from '../db/user';
import { authMiddleware } from '../middleware/auth';

const chatroomRoutes = express.Router();

chatroomRoutes.use(authMiddleware);

chatroomRoutes.get('/:name/messages', async (req, res) => {
  const chatroomName = req.params.name;
  if (!chatroomName) {
    res.status(404).send('Chatroom name missing');
  }
  const chatroom = await chatroomDB.get(chatroomName);
  if (!chatroom) {
    res.status(404).send('No chatroom with that name');
  }
  const chatroomId = chatroom?.id;
  if (!chatroomId) {
    res.status(500).send('Unable to get messages');
    return;
  }
  try {
    const messages = await chatMessageDB.get(chatroom.id);
    res.send(messages).status(200);
  } catch (e) {
    res.status(500).send('Unable to get messages');
    return;
  }
});

chatroomRoutes.get('/:name/users', async (req, res) => {
  const chatroomName = req.params.name;
  if (!chatroomName) {
    res.status(404).send('Chatroom name missing');
  }
  const chatroom = await chatroomDB.get(chatroomName);
  if (!chatroom) {
    res.status(404).send('No chatroom with that name');
  }
  const chatroomId = chatroom?.id;
  if (!chatroomId) {
    res.status(500).send('Unable to get chatroom');
    return;
  }
  try {
    const chatroomUsers = await userDB.inRoom(chatroomId);
    res.send(chatroomUsers).status(200);
  } catch (e) {
    res.status(500).send('Unable to get chatroom users');
    return;
  }
});

export default chatroomRoutes;
