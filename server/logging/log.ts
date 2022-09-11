import * as fs from 'fs';
import { ChatMessage } from '../../types';
import { connectedUsers } from '../routes/socket';

let logDisconnectTimeout: NodeJS.Timeout;
export const logDisconnect = (username: string) => {
  clearTimeout(logDisconnectTimeout);
  logDisconnectTimeout = setTimeout(() => {
    if (!connectedUsers.get(username)) log(`${username} disconnected`);
  }, 1000);
};

export const log = (text: any) => {
  const date = new Date().toLocaleDateString('se');
  const time = new Date().toLocaleTimeString('se');
  const logMessage = `[${date} - ${time}] ${text}`;
  console.log(logMessage);
  logToFile(logMessage);
};

export const logChatMessage = (chatMessage: ChatMessage) => {
  const logMessageLength = 10;
  const message = chatMessage.message;
  // const cutMessage = message.slice(0, logMessageLength) + (message.length > logMessageLength ? '...' : '');
  log(`"${message}" - ${chatMessage.username} in ${chatMessage.room}`);
};

const logToFile = (log: string) => {
  fs.appendFile('logging/test.log', log + '\n', (err) => {
    if (err) console.error(err);
  });
};
