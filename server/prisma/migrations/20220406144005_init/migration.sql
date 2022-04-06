-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "password" VARCHAR(100) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "role" VARCHAR(15) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
