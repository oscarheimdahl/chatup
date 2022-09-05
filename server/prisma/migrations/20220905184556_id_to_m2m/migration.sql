/*
  Warnings:

  - The primary key for the `UserChatroom` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "UserChatroom" DROP CONSTRAINT "UserChatroom_pkey",
ADD CONSTRAINT "UserChatroom_pkey" PRIMARY KEY ("chatroomId", "userId");
