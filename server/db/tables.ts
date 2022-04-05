import { poolQuery } from '.';

const tables = [
  {
    name: 'users',
    query: `
  CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL,
    "name" VARCHAR(100) NOT NULL,
    "role" VARCHAR(15) NOT NULL,
    PRIMARY KEY ("id")
  );`,
  },
  {
    name: 'messages',
    query: `
  CREATE TABLE IF NOT EXISTS "messages" (
    "id" SERIAL,
    "name" VARCHAR(100) NOT NULL,
    "role" VARCHAR(15) NOT NULL,
    PRIMARY KEY ("id")
  );`,
  },
];

export const initDB = () => {
  tables.forEach((table) => {
    poolQuery(table.query).then((result) => {
      if (result) {
        console.log(`${table.name} created`);
      }
    });
  });
};
