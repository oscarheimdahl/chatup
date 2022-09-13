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
  const username = useAppSelector((s) => s.user.username);

  let lastUsername = setLastUsername;

  return (
    <>
      {chatMessages.map((message, i) => {
        const ownMessage = message.username === username;
        const ownMessageClass = ownMessage ? 'own-message' : '';
        const showUsername = !ownMessage && lastUsername !== message.username;
        const messageColor = usernameColors?.get(message.username);

        const MessageBubble = ({ admin }: { admin?: boolean }) => (
          <span className={`message-bubble ${ownMessageClass} ${admin ? 'admin' : ''}`}>
            {showUsername && <span className='sender'>{message.username}</span>}
            <span className={`message color-${messageColor}`}>{message.message}</span>
          </span>
        );

        const SystemMessage = () => <span className='system-message'>{message.message}</span>;

        const buildMessage = (username: string) => {
          if (username === 'system') return <SystemMessage />;
          if (username === 'admin') return <MessageBubble admin />;
          return <MessageBubble />;
        };

        const Message = () => <div className={'message-row ' + ownMessageClass}>{buildMessage(message.username)}</div>;

        lastUsername = message.username;
        return <Message key={messageKey + i} />;
      })}
    </>
  );
};

export default Messages;
