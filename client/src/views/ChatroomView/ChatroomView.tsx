import useSocket from '@src/hooks/useSocket';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { useEffect, useRef, useState } from 'react';

import KeyboardArrowLeftSharpIcon from '@mui/icons-material/KeyboardArrowLeftSharp';
import Button from '@src/components/Button/Button';
import Input from '@src/components/Input/Input';
import { host } from '@src/config/vars';
import { setRoom } from '@src/store/slices/userSlice';
import axios from 'axios';
import { ChatMessage } from '../../../../types';
import './chatroom-view.scss';
import { useNavigate } from 'react-router-dom';
import { useScrollToBottomOnLoad } from '@src/hooks/useScrollToBottomOnLoad';

interface ChatroomViewProps {}

const ChatroomView = ({}: ChatroomViewProps) => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const room = useAppSelector((s) => s.user.room);
  const token = useAppSelector((s) => s.user.token);
  const username = useAppSelector((s) => s.user.username);
  const dispatch = useAppDispatch();
  const [newMessages, setNewMessages] = useState<ChatMessage[]>([]);
  const { containerRef: messageContainerRef, scrollToBottom } = useScrollToBottomOnLoad();

  useEffect(() => {
    if (!room) navigate({ pathname: '/' });
  }, []);

  useEffect(() => {
    socket.on('CHAT_MESSAGE', (chatMessage) => {
      updateNewMessages(chatMessage);
    });
  }, [socket]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;
    const chatMessage: ChatMessage = { message, room, username, sentDate: new Date() };
    socket.emit('CHAT_MESSAGE', chatMessage, token);
    updateNewMessages(chatMessage);
    setMessage('');
  };

  const updateNewMessages = (chatMessage: ChatMessage) => {
    setNewMessages((previousMessages) => [...previousMessages, chatMessage]);
    scrollToBottom();
  };

  const handleBack = () => {
    dispatch(setRoom(''));
    navigate({ pathname: '/' });
  };

  if (!room) return <></>;

  return (
    <div id='room-view' className='full-screen'>
      <div id='room-view-content' className='floating-window'>
        <div className='room-header'>
          <button onClick={handleBack} className='back-button'>
            <KeyboardArrowLeftSharpIcon className='indicator' />
          </button>
          <h1>{room}</h1>
        </div>
        <MessageContainer newMessages={newMessages} messageContainerRef={messageContainerRef} room={room} />
        <form spellCheck='false' autoComplete='off' className='join-room-form' onSubmit={(e) => sendMessage(e)}>
          <section className='message-input-container'>
            <Input name='message-input' value={message} onChange={(e) => setMessage(e.target.value)} />
            <Button type='submit'>Send</Button>
          </section>
        </form>
      </div>
    </div>
  );
};

interface MessageContainerProps {
  room: string;
  newMessages: ChatMessage[];
  messageContainerRef: React.RefObject<HTMLDivElement>;
}

const MessageContainer = ({ room, newMessages, messageContainerRef }: MessageContainerProps) => {
  const [oldMessages, setOldMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const getMessages = async () => {
      const messages = await axios.get(host + `chatroom/${room}/messages`);
      setOldMessages(messages.data);
    };
    getMessages();
  }, []);

  const lastOldMessageUsername = oldMessages[oldMessages.length - 1]?.username ?? '';

  return (
    <section ref={messageContainerRef} className='message-container'>
      <Messages chatMessages={oldMessages} messageKey='old-messages' />
      <Messages chatMessages={newMessages} messageKey='new-messages' setLastUsername={lastOldMessageUsername} />
    </section>
  );
};

interface MessagesProps {
  chatMessages: ChatMessage[];
  messageKey: string;
  setLastUsername?: string;
}

const Messages = ({ chatMessages, messageKey = '', setLastUsername = '' }: MessagesProps) => {
  const username = useAppSelector((s) => s.user.username);
  let lastUsername = setLastUsername;
  return (
    <>
      {chatMessages.map((message, i) => {
        const ownMessage = message.username === username;
        const ownMessageClass = ownMessage ? 'own-message' : '';
        const showUsername = !ownMessage && lastUsername !== message.username;
        const messageRender = (
          <div className={'message-row ' + ownMessageClass} key={messageKey + '-' + i}>
            <span className={`message-bubble ${ownMessageClass}`}>
              {showUsername && <span className='sender'>{message.username}</span>}
              <span className='message'>{message.message}</span>
            </span>
          </div>
        );
        lastUsername = message.username;
        return messageRender;
      })}
    </>
  );
};

export default ChatroomView;
