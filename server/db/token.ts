import * as jwt from 'jsonwebtoken';

export const generateNewToken = (username: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('No JWT_SECRET available');
  }
  return jwt.sign({ username }, secret, { expiresIn: '10s' });
};

export const verifyToken = async (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('No JWT_SECRET available');
  }
  try {
    jwt.verify(token, secret);
  } catch (e) {
    return false;
  }
  return true;
};
