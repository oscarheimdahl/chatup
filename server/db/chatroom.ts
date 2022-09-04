import { PrismaClient } from '@prisma/client';
import { hash } from './hash';
import { getUser } from './user';

const prisma = new PrismaClient();

export const createChatroom = async (name: string, usernames: string[] | string) => {
  const oldName = await getChatroom(name);

  if (oldName) {
    return 'Room name already taken.';
  }

  if (typeof usernames === 'string') usernames = [usernames];

  usernames.map(async (username) => await getUser(username));

  await prisma.chatroom.create({
    data: {
      name,
    },
  });
};

export const getChatroom = async (name: string) => {
  const chatroom = await prisma.chatroom.findFirst({
    where: { name },
  });
  return chatroom;
};
