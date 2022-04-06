import * as express from 'express';
import { compareHash } from '../db/hash';
import { generateNewToken } from '../db/token';
import { createUser, getUser } from '../db/user';

const userRoutes = express.Router();

userRoutes.get('/login', async (req, res) => {
  const { username, password } = req.body;
  const errMessage = validateLogin(username, password);

  if (errMessage) {
    res.status(400).send(errMessage);
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

const validateLogin = (username: string, password: string) => {
  if (!username) return 'Missing field: username';
  if (!password) return 'Missing field: password';
};

const validateRegister = (username: string, password: string) => {
  const errorMessage = validateLogin(username, password);
  if (errorMessage) {
    return errorMessage;
  }
  if (username.length < 5) return `Username can't be shorter than 5`;
  if (password.length < 8) return `Password can't be shorter than 8`;
};

export default userRoutes;
