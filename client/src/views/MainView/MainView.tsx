import useSocket from '@src/hooks/useSocket';
import { useAppSelector } from '@src/store/hooks';
import { useState } from 'react';
import { ChatMessage } from '../../../../types';

const MainView = () => {
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');

  const socket = useSocket();
  const token = useAppSelector((s) => s.user.token);

  const handleRoomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoom(e.target.value);
  };
  const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    const roomMessage: ChatMessage = { room, message, token: token };
    socket.emit('message', roomMessage);
  };

  return (
    <>
      <h1>Welcome to the main page</h1>
      <label htmlFor='room'>Room</label>
      <br />
      <input name='room' value={room} type='text' onChange={handleRoomInput} />
      <br />
      <label htmlFor='message'>message</label>
      <br />
      <input name='message' value={message} type='text' onChange={handleMessageInput} />
      <br />
      <button onClick={sendMessage}>Send message</button>
    </>
  );
};

export default MainView;
