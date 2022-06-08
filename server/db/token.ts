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
  return jwt.sign({ username }, secret, { expiresIn: '100s' });
};

export const verifyToken = (token: string) => {
  if (!token) return false;
  const secret = getSecret();

  try {
    jwt.verify(token, secret);
  } catch (e) {
    return false;
  }
  return true;
};

export const decodeToken = async (token: string): Promise<jwt.JwtPayload | undefined> => {
  if (!token) return;

  try {
    const decodedToken = jwt.decode(token);
    return decodedToken as jwt.JwtPayload;
  } catch (e) {
    return;
  }
};
