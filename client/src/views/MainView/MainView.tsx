import { useEffect, useState } from 'react';

import Button from '@src/components/Button/Button';
import Input from '@src/components/Input/Input';
import { useNavigate } from 'react-router-dom';

import ColorChooser from '@src/components/ColorChooser/ColorChooser';
import { useAdmin } from '@src/hooks/useCanDownload';
import './main-view.scss';

const MainView = () => {
  const [visible, setVisible] = useState(false);
  const [useTransition, setUseTransition] = useState(false);
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');

  useAdmin();

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

  const handleRoomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate({ pathname: `room/${roomName}` });
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
