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
import { useScrollToBottom } from '@src/hooks/useScrollToBottomOnLoad';

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
  const { containerRef: messageContainerRef, scrollToBottom } = useScrollToBottom();
  const color = useAppSelector((s) => s.user.color);

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
    const chatMessage: ChatMessage = { message, room, username, sentDate: new Date(), color };
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
        <MessageContainer
          newMessages={newMessages}
          messageContainerRef={messageContainerRef}
          room={room}
          scrollToBottom={scrollToBottom}
        />
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
  scrollToBottom: () => void;
}

interface RoomUsers {
  username: string;
  color: number;
}

const MessageContainer = ({ room, newMessages, messageContainerRef, scrollToBottom }: MessageContainerProps) => {
  const [oldMessages, setOldMessages] = useState<ChatMessage[]>([]);
  const [usernameColors, setUsernameColors] = useState<Map<string, number>>(new Map());
  const [showMessages, setShowMessages] = useState(false);
  const socket = useSocket();
  useEffect(() => {
    const getMessages = async () => {
      const res = await axios.get(host + `chatroom/${room}/messages`);
      setOldMessages(res.data);
      scrollToBottom();
      setTimeout(() => setShowMessages(true), 300);
    };
    getMessages();
  }, []);

  useEffect(() => {
    socket.on('OTHER_JOINED_ROOM', (user) => {
      const { username, color } = user;
      const oldColor = usernameColors.get(username);
      if (oldColor !== color) {
        setUsernameColors((prevUsernameColors) => {
          const nextUsernameColors = new Map(prevUsernameColors);
          nextUsernameColors.set(username, color);
          return nextUsernameColors;
        });
      }
    });
    getUsersInRoom();
  }, []);

  const getUsersInRoom = async () => {
    const res = await axios.get(host + `chatroom/${room}/users`);
    const users: { username: string; color: number }[] = res.data;
    const roomUsersMap = new Map<string, number>();
    users.map((user) => roomUsersMap.set(user.username, user.color));
    setUsernameColors(roomUsersMap);
  };

  const lastOldMessageUsername = oldMessages[oldMessages.length - 1]?.username ?? '';

  return (
    <section style={{ opacity: showMessages ? 1 : 0 }} ref={messageContainerRef} className='message-container'>
      <Messages chatMessages={oldMessages} usernameColors={usernameColors} messageKey='old-messages' />
      <Messages
        chatMessages={newMessages}
        usernameColors={usernameColors}
        messageKey='new-messages'
        setLastUsername={lastOldMessageUsername}
      />
    </section>
  );
};

interface MessagesProps {
  chatMessages: ChatMessage[];
  messageKey: string;
  setLastUsername?: string;
  usernameColors: Map<string, number>;
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

        const MessageBubble = () => (
          <span className={`message-bubble ${ownMessageClass}`}>
            {showUsername && <span className='sender'>{message.username}</span>}
            <span className={`message color-${usernameColors.get(message.username)}`}>{message.message}</span>
          </span>
        );

        const messageRender = (
          <div className={'message-row ' + ownMessageClass} key={messageKey + '-' + i}>
            {message.username === 'system' ? (
              <span className='system-message'>{message.message}</span>
            ) : (
              <MessageBubble />
            )}
          </div>
        );
        lastUsername = message.username;
        return messageRender;
      })}
    </>
  );
};

export default ChatroomView;
