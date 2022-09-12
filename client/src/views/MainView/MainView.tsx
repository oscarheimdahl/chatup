import useSocket from '@src/hooks/useSocket';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { useEffect, useState } from 'react';

import Button from '@src/components/Button/Button';
import Input from '@src/components/Input/Input';
import { useNavigate } from 'react-router-dom';

import { useAdmin } from '@src/hooks/useCanDownload';
import { setRoom } from '@src/store/slices/userSlice';
import './main-view.scss';
import ColorChooser from '@src/components/ColorChooser/ColorChooser';

const MainView = () => {
  const [visible, setVisible] = useState(false);
  const [useTransition, setUseTransition] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('show-login-transition') === 'true') {
      setTimeout(() => {
        setVisible(true);
        setUseTransition(true);
      });
      localStorage.removeItem('show-login-transition');
    } else {
      setVisible(true);
    }
  }, []);

  useAdmin();
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState('');

  const socket = useSocket();
  const token = useAppSelector((s) => s.user.token);
  const dispatch = useAppDispatch();

  const handleRoomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('JOIN_ROOM_REQUEST', roomName, token);

    socket.once('JOINED_ROOM', ({ room, preExisting }) => {
      setRoomName(room);
      dispatch(setRoom(room));
      navigate({ pathname: 'room' });
    });
  };

  return (
    <div
      id='main-view'
      style={{ opacity: visible ? 1 : 0, transitionDuration: useTransition ? '800ms' : '0' }}
      className='full-screen'
    >
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
        <ColorChooser />
      </div>
    </div>
  );
};

export default MainView;
