import * as express from 'express';
import { createChatroom, getChatroom } from '../db/chatroom';
import { getMessages } from '../db/message';
import { authMiddleware } from '../middleware/auth';

const roomRoutes = express.Router();

roomRoutes.use(authMiddleware);

roomRoutes.get('/:name/messages', async (req, res) => {
  console.log(req.headers);
  const chatroomName = req.params.name;
  if (!chatroomName) {
    res.status(404).send('Chatroom name missing');
  }
  const chatroom = await getChatroom(chatroomName);
  if (!chatroom) {
    res.status(404).send('No chatroom with that name');
  }
  const chatroomId = chatroom?.id;
  if (!chatroomId) {
    res.status(500).send('Unable to get messages');
    return;
  }
  try {
    const messages = await getMessages(chatroom.id);
    res.send(messages).status(200);
  } catch (e) {
    res.status(500).send('Unable to get messages');
    return;
  }
});

export default roomRoutes;
