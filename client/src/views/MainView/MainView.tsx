import useSocket from '@src/hooks/useSocket';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { useEffect, useRef, useState } from 'react';

import './main-view.scss';
import Input from '@src/components/Input/Input';
import Button from '@src/components/Button/Button';

const MainView = () => {
  const [room, setRoom] = useState('');
  const [inRoom, setInRoom] = useState(false);

  const socket = useSocket();
  const token = useAppSelector((s) => s.user.token);
  const dispatch = useAppDispatch();

  const handleRoomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoom(e.target.value);
  };

  const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('joining room...');
    socket.emit('JOIN_ROOM_REQUEST', room, token);

    socket.once('JOINED_ROOM', ({ old, room }) => {
      console.log(`joined room, ${room}. Old room: ${old}`);
      setInRoom(true);
    });
  };

  if (inRoom) return <Room room={room} />;

  return (
    <div id='main-view' className='full-screen'>
      <div id='main-view-content' className='floating-window'>
        <form spellCheck='false' autoComplete='off' className='join-room-form' onSubmit={(e) => joinRoom(e)}>
          <Input
            placeholder={'Room name...'}
            label='Join a chat room'
            name='room-name'
            onChange={handleRoomInput}
            value={room}
          />
          <Button type='submit'>Join</Button>
        </form>
      </div>
    </div>
  );
};

interface RoomProps {
  room: string;
}

const Room = ({ room }: RoomProps) => {
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const token = useAppSelector((s) => s.user.token);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;
    socket.emit('CHAT_MESSAGE', message, token);
    setMessage('');
  };

  return (
    <div id='room-view' className='full-screen'>
      <div id='room-view-content' className='floating-window'>
        <div className='room-header'>
          <h1>{room}</h1>
        </div>
        <Messages />
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

interface Message {
  text: string;
  sender: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = useSocket();
  const username = useAppSelector((s) => s.user.username);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!socket) return;
    socket.on('CHAT_MESSAGE', (message, sender) => {
      setMessages((previousMessages) => [...previousMessages, { text: message, sender }]);
      setTimeout(() => latestMessageRef.current?.scrollTo(0, latestMessageRef?.current.scrollHeight), 200);
    });
  }, [socket]);

  return (
    <section ref={latestMessageRef} className='message-container'>
      {messages.map((message, i) => {
        return (
          <div key={'message' + i} className={`message-bubble ${message.sender === username ? 'own-message' : ''}`}>
            <span>{message.text}</span>
          </div>
        );
      })}
    </section>
  );
};

export default MainView;
