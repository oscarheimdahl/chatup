import { PrismaClient } from '@prisma/client';
import { hash } from './hash';

const prisma = new PrismaClient();

interface User {
  username: string;
  password: string;
}

export const createUser = async (user: User) => {
  const oldUser = await getUser(user.username);

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

export const getUser = async (username: string) => {
  const user = await prisma.user.findFirst({
    where: { username: username },
  });
  if (!user?.username || !user.password) return null;
  return user;
};

export const setColor = async (username: string, colorNum: number) => {
  await prisma.user.update({
    where: {
      username,
    },
    data: {
      color: +colorNum,
    },
  });
};
