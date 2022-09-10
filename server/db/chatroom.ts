import { prisma } from './init';
import { getUser } from './user';

export const createChatroom = async (name: string) => {
  return await prisma.chatroom.create({
    data: {
      name,
    },
  });
};

export const joinChatRoom = async (chatroomId: number, usernames: string | string[]) => {
  if (typeof usernames === 'string') usernames = [usernames];
  const newUsersPromises = usernames.map(async (username) => getUser(username));
  const newUsers = await Promise.all(newUsersPromises);
  const newUserIds = newUsers.map((user) => user?.id).filter((id) => id !== undefined) as number[];

  // const chatroomUsers = chatroom?.users ?? [];

  //TODO ADD USER TO CHATROOM AND CHATROOM TO USER AND MANY TO MANY CONNECTION
  // const allUsers = [...chatroomUsers, ...newUserIds];
  await prisma.userChatroom.createMany({
    data: newUserIds.map((userId) => {
      return { userId, chatroomId };
    }),
    skipDuplicates: true,
  });
};

export const getChatroom = async (name: string) => {
  const chatroom = await prisma.chatroom.findFirst({
    where: { name },
  });
  return chatroom;
};
