import * as bcrypt from 'bcrypt';

export const compareHash = async (str: string, hash: string) => {
  return await bcrypt.compare(str, hash);
};

export const hash = async (str: string) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(str, salt);
  return hash;
};
