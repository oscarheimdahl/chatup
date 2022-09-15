import { ChatMessage } from '../../../types';
import { log } from '../logging/log';
import chatroomDB from './chatroom';
import { prisma } from './init';
import userDB from './user';

const create = async (chatMessage: ChatMessage) => {
  const user = await userDB.get(chatMessage.username);
  if (!user?.id) {
    log(`Unable to create chatmessage, missing userId on username: ${chatMessage.username}`);
    return;
  }
  const chatroom = await chatroomDB.get(chatMessage.room);
  if (!chatroom?.id) {
    log(`Unable to create chatmessage, missing id on chatroom: ${chatMessage.room}`);
    return;
  }
  await prisma.chatMessage.create({
    data: {
      userId: user.id,
      chatroomId: chatroom.id,
      message: chatMessage.text,
      sentDate: chatMessage.sentDate,
    },
  });
};

const get = async (chatroomId: number): Promise<ChatMessage[]> => {
  const messages = await prisma.chatMessage.findMany({
    where: { chatroomId },
    select: {
      user: {
        select: {
          username: true,
          color: true,
        },
      },
      chatroom: {
        select: {
          name: true,
        },
      },
      message: true,
      sentDate: true,
    },
  });

  const chatMessages: ChatMessage[] = messages.map((message): ChatMessage => {
    return {
      color: message.user.color,
      username: message.user.username,
      text: message.message,
      room: message.chatroom.name,
      sentDate: message.sentDate,
    };
  });

  return chatMessages;
};

export default { get, create };
