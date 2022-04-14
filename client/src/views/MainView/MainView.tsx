import { host } from '@src/config/vars';
import { useAppSelector } from '@src/store/hooks';
import { useState } from 'react';
import { io } from 'socket.io-client';

const MainView = () => {
  const token = useAppSelector((s) => s.user.token);
  const [roomName, setRoomName] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const joinRoom = () => {
    const socket = io(host, { auth: { token: token + '1' } });

    console.log(roomName);
  };

  return (
    <>
      <h1>Welcome to the main page</h1>
      <input type='text' onChange={handleInput} />
      <button onClick={joinRoom}>Join room</button>
    </>
  );
};

export default MainView;
