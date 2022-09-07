import * as express from 'express';
import { compareHash } from '../db/hash';
import { generateNewToken } from '../db/token';
import { createUser, getUser } from '../db/user';
import { authMiddleware } from '../middleware/auth';

const userRoutes = express.Router();

userRoutes.get('/loggedin', authMiddleware, async (req, res) => {
  console.log('User logged in');
  res.status(200).send(res.locals.username);
});

userRoutes.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const errMessage = validateCredentials(username, password);

  if (errMessage) {
    return res.status(400).send(errMessage);
  }

  const user = await getUser(username);
  if (!user) {
    return res.status(403).end();
  }

  const passwordMatch = await compareHash(password, user.password);
  if (!passwordMatch) {
    return res.status(403).end();
  }

  let token;

  try {
    token = generateNewToken(username);
  } catch (e) {
    return res.status(500);
  }

  return res.status(200).send(token);
});

userRoutes.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const errMessage = validateRegister(username, password);

  if (errMessage) {
    return res.status(400).send(errMessage);
  }

  try {
    const oldUserErr = await createUser({ username, password });
    if (oldUserErr) {
      return res.status(409).send(oldUserErr);
    }
  } catch (e) {
    return res.status(500).end();
  }

  return res.status(201).end();
});

const validateCredentials = (username: string, password: string) => {
  if (!username) return 'Missing field: username';
  if (!password) return 'Missing field: password';
};

const validateRegister = (username: string, password: string) => {
  const errorMessage = validateCredentials(username, password);
  if (errorMessage) {
    return errorMessage;
  }
  if (username.length < 5) return `Username can't be shorter than 5`;
  if (password.length < 8) return `Password can't be shorter than 8`;
};

export default userRoutes;
