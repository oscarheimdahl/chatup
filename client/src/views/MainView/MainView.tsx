import { useState } from 'react';
import { io } from 'socket.io-client';

const MainView = () => {
  const [roomName, setRoomName] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const joinRoom = () => {
    const app = io();

    app.connect;
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
