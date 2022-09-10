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
import './main-view.scss';

const MainView = () => {
  const [roomName, setRoomName] = useState('');
  const room = useAppSelector((s) => s.user.room);

  const socket = useSocket();
  const token = useAppSelector((s) => s.user.token);
  const dispatch = useAppDispatch();

  const handleRoomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('join room:', socket);
    if (!socket) return;
    e.preventDefault();
    // console.log('joining room...');
    console.log('room:', roomName);
    socket.emit('JOIN_ROOM_REQUEST', roomName, token);

    socket.once('JOINED_ROOM', ({ room, preExisting }) => {
      console.log(`joined room, ${room}. Old room: ${preExisting}`);
      setRoomName(room);
      dispatch(setRoom(room));
    });
  };

  if (room) return <Room />;

  return (
    <div id='main-view' className='full-screen'>
      <div id='main-view-content' className='floating-window'>
        <form spellCheck='false' autoComplete='off' className='join-room-form' onSubmit={(e) => joinRoom(e)}>
          <Input
            placeholder={'Room name...'}
            label='Join a chat room'
            name='room-name'
            onChange={handleRoomInput}
            value={roomName}
          />
          <Button type='submit'>Join</Button>
        </form>
      </div>
    </div>
  );
};

interface RoomProps {}

const Room = ({}: RoomProps) => {
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const room = useAppSelector((s) => s.user.room);
  const token = useAppSelector((s) => s.user.token);
  const username = useAppSelector((s) => s.user.username);
  const dispatch = useAppDispatch();
  const [newMessages, setNewMessages] = useState<ChatMessage[]>([]);
  const messageContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (messageContainer.current) {
        messageContainer.current.style.scrollBehavior = '';
        scrollToBottom();
      }
    }, 20);
  }, [messageContainer]);

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

  const scrollToBottom = () => {
    setTimeout(() => {
      messageContainer.current?.scrollTo(0, messageContainer?.current.scrollHeight);
      if (messageContainer.current) messageContainer.current.style.scrollBehavior = 'smooth';
    }, 50);
  };

  const updateNewMessages = (chatMessage: ChatMessage) => {
    setNewMessages((previousMessages) => [...previousMessages, chatMessage]);
    scrollToBottom();
  };

  const handleBack = () => {
    dispatch(setRoom(''));
  };

  return (
    <div id='room-view' className='full-screen'>
      <div id='room-view-content' className='floating-window'>
        <div className='room-header'>
          <button onClick={handleBack} className='back-button'>
            <KeyboardArrowLeftSharpIcon className='indicator' />
          </button>
          <h1>{room}</h1>
        </div>
        <Messages newMessages={newMessages} messageContainer={messageContainer} room={room} />
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

interface MessagesProps {
  room: string;
  newMessages: ChatMessage[];
  messageContainer: React.RefObject<HTMLDivElement>;
}

const Messages = ({ room, newMessages, messageContainer }: MessagesProps) => {
  const [oldMessages, setOldMessages] = useState<ChatMessage[]>([]);

  const username = useAppSelector((s) => s.user.username);

  useEffect(() => {
    const getMessages = async () => {
      const messages = await axios.get(host + `chatroom/${room}/messages`);
      setOldMessages(messages.data);
    };
    getMessages();
  }, []);

  return (
    <section ref={messageContainer} className='message-container'>
      {oldMessages.map((message, i) => {
        return (
          <div
            key={'old-message' + i}
            className={`message-bubble ${message.username === username ? 'own-message' : ''}`}
          >
            <span className='message'>{message.message}</span>
            <span className='sender'>{message.username}</span>
          </div>
        );
      })}
      {newMessages.map((message, i) => {
        return (
          <div key={'message' + i} className={`message-bubble ${message.username === username ? 'own-message' : ''}`}>
            <span className='message'>{message.message}</span>
            <span className='sender'>{message.username}</span>
          </div>
        );
      })}
    </section>
  );
};

export default MainView;
