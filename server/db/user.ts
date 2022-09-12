import { PrismaClient } from '@prisma/client';
import { hash } from './hash';
import chatroomDB from './chatroom';

const prisma = new PrismaClient();

interface User {
  username: string;
  password: string;
}

const create = async (user: User) => {
  const oldUser = await get(user.username);

  if (oldUser) {
    return 'Username already taken.';
  }

  await prisma.user.create({
    data: {
      username: user.username,
      password: await hash(user.password),
      color: Math.floor(Math.random() * 8),
    },
  });
};

const get = async (username: string) => {
  const user = await prisma.user.findFirst({
    where: { username: username },
  });
  if (!user?.username || !user.password) return null;
  return user;
};

const setColor = async (username: string, colorNum: number) => {
  await prisma.user.update({
    where: {
      username,
    },
    data: {
      color: +colorNum,
    },
  });
};

const inRoom = async (chatroomId: number) => {
  const useridsInChatroom = await prisma.userChatroom.findMany({
    where: {
      chatroomId: chatroomId,
    },
    select: {
      userId: true,
    },
  });
  const userIds = useridsInChatroom.map((user) => user.userId);

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: {
      password: false,
      color: true,
      username: true,
    },
  });

  return users;
};

export default { create, get, setColor, inRoom };
