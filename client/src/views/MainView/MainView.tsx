import useSocket from '@src/hooks/useSocket';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { useState } from 'react';

import './main-view.scss';
import Input from '@src/components/Input/Input';
import Button from '@src/components/Button/Button';

const MainView = () => {
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');

  const socket = useSocket();
  const token = useAppSelector((s) => s.user.token);
  const dispatch = useAppDispatch();

  const handleRoomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoom(e.target.value);
  };

  const joinRoom = () => {
    console.log('joining room...');
    socket.emit('JOIN_ROOM_REQUEST', room, token);

    socket.once('JOINED_ROOM', ({ old }) => {
      console.log(`joined room, ${room}. Old room: ${old}`);
    });
  };

  return (
    <div id='main-view'>
      <div id='main-view-content' className=' floating-window'>
        <Input
          placeholder={'Room name...'}
          label='Join a chat room'
          name='room-name'
          onChange={handleRoomInput}
          value={room}
        />
        <Button onClick={joinRoom}>Join</Button>
      </div>
    </div>
  );
};

export default MainView;
