import { prisma } from './init';
import userDB from './user';

const create = async (name: string) => {
  return await prisma.chatroom.create({
    data: {
      name,
    },
  });
};

const join = async (chatroomId: number, usernames: string | string[]) => {
  if (typeof usernames === 'string') usernames = [usernames];
  const newUsersPromises = usernames.map(async (username) => userDB.get(username));
  const newUsers = await Promise.all(newUsersPromises);
  const newUserIds = newUsers.map((user) => user?.id).filter((id) => id !== undefined) as number[];

  await prisma.userChatroom.createMany({
    data: newUserIds.map((userId) => {
      return { userId, chatroomId };
    }),
    skipDuplicates: true,
  });
};

const get = async (name: string) => {
  const chatroom = await prisma.chatroom.findFirst({
    where: { name },
  });
  return chatroom;
};

export default { create, join, get };
