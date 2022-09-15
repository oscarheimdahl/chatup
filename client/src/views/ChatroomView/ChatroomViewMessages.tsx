import { useAppSelector } from '@src/store/hooks';

import { ChatMessage } from '../../../../types';
import './chatroom-view.scss';

interface MessagesProps {
  chatMessages: ChatMessage[];
  messageKey: string;
  setLastUsername?: string;
  usernameColors?: Map<string, number>;
}

const Messages = ({ chatMessages, messageKey = '', setLastUsername = '', usernameColors }: MessagesProps) => {
  const ownUsername = useAppSelector((s) => s.user.username);
  let lastUsername = setLastUsername;

  return (
    <>
      {chatMessages.map((chatMessage, i) => {
        const { text, username } = chatMessage;
        const ownMessage = username === ownUsername;
        const ownMessageClass = ownMessage ? 'own-message' : '';

        const SystemMessage = () => <span className='system-message'>{text}</span>;

        const buildMessage = () => {
          if (username === 'system') return <SystemMessage />;

          return (
            <Message
              message={chatMessage}
              // username={username}
              // text={text}
              color={usernameColors?.get(username) ?? 0}
              ownMessage={ownMessage}
              // admin={username === 'admin'}
              lastUsername={lastUsername}
            />
          );
        };

        const message = buildMessage();
        lastUsername = username;

        return (
          <div key={messageKey + i} className={'message-row ' + ownMessageClass}>
            {message}
          </div>
        );
      })}
    </>
  );
};

interface MessageProps {
  message: ChatMessage;
  color: number;
  ownMessage: boolean;
  lastUsername: string;
}

const Message = ({ message, color, ownMessage, lastUsername }: MessageProps) => {
  const { text, username } = message;
  const adminClass = message.username === 'admin' ? 'admin' : '';
  const showUsername = !ownMessage && lastUsername !== username;

  return (
    <span className={`message ${adminClass}`}>
      {showUsername && <span className='sender'>{username}</span>}
      <span className={`text-bubble color-${color}`}>{text}</span>
      {/* <span className='message-tooltip'>12:23</span> */}
    </span>
  );
};

export default Messages;
