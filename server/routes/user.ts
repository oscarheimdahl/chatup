import * as express from 'express';
import { compareHash } from '../db/hash';
import { generateNewToken } from '../db/token';
import userDB from '../db/user';
import { log } from '../logging/log';
import { authMiddleware } from '../middleware/auth';

const userRoutes = express.Router();

userRoutes.get('/loggedin', authMiddleware, async (req, res) => {
  const user = await userDB.get(res.locals.username);
  if (!user) return res.status(500);
  res.status(200).send({ username: user.username, color: user.color });
});

userRoutes.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const errMessage = validateCredentials(username, password);

  if (errMessage) {
    return res.status(400).send(errMessage);
  }

  const user = await userDB.get(username);
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
  log(`${username} logged in!`);
  return res.status(200).send(token);
});

userRoutes.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const errMessage = validateRegister(username, password);

  if (errMessage) {
    return res.status(400).send(errMessage);
  }

  try {
    const oldUserErr = await userDB.create({ username, password });
    if (oldUserErr) {
      return res.status(409).send(oldUserErr);
    }
  } catch (e) {
    return res.status(500).end();
  }

  log(`${username} registered!`);
  return res.status(201).end();
});

userRoutes.put('/color', authMiddleware, async (req, res) => {
  const username = res.locals.username;
  const { color } = req.body;
  const errMessage = validateColor(color, username);

  if (errMessage) {
    return res.status(400).send(errMessage);
  }

  try {
    await userDB.setColor(username, color);
  } catch (e) {
    return res.status(500).send('Error setting color');
  }

  log(`${username} updated color to ${color}`);
  return res.status(204).end();
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

const validateColor = (color: number, username: string) => {
  if (!username) return 'Username missing';
  if (color < 0 || color > 7) return 'Color must be between 0 and 7';
};

export default userRoutes;
