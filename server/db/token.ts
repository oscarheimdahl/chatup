import * as jwt from 'jsonwebtoken';

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('No JWT_SECRET available');
  }
  return secret;
};
export const generateNewToken = (username: string) => {
  const secret = getSecret();
  return jwt.sign({ username }, secret, { expiresIn: '10s' });
};

export const verifyToken = async (token: string) => {
  if (!token) return false;
  const secret = getSecret();

  try {
    jwt.verify(token, secret);
  } catch (e) {
    return false;
  }
  return true;
};

export const decodeToken = async (token: string) => {
  if (!token) return false;
  const secret = getSecret();

  try {
    return jwt.decode(token);
  } catch (e) {
    return '';
  }
};
