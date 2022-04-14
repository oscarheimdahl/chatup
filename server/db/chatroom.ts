import { PrismaClient } from '@prisma/client';
import { hash } from './hash';

const prisma = new PrismaClient();

export const createChatroom = async (name: string) => {
  const oldName = await getChatroom(name);

  if (oldName) {
    return 'Room name already taken.';
  }

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
