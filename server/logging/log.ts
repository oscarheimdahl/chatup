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
  console.log(`[${date} - ${time}] ${text}`);
};

export const logMessage = (chatMessage: ChatMessage) => {
  const logMessageLength = 10;
  const message = chatMessage.message;
  const cutMessage = message.slice(0, logMessageLength) + (message.length > logMessageLength ? '...' : '');
  log(`"${cutMessage}" - ${chatMessage.username} in ${chatMessage.room}`);
};
