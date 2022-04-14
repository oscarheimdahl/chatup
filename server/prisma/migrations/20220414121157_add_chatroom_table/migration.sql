-- CreateTable
CREATE TABLE "chatroom" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "users" TEXT[],

    CONSTRAINT "chatroom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chatroom_name_key" ON "chatroom"("name");
