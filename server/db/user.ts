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
