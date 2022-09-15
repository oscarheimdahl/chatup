import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { useEffect, useState } from 'react';

import KeyboardArrowLeftSharpIcon from '@mui/icons-material/KeyboardArrowLeftSharp';
import { socket } from '@src/App';
import Button from '@src/components/Button/Button';
import Input from '@src/components/Input/Input';
import { useScrollToBottom } from '@src/hooks/useScrollToBottomOnLoad';
import { setMessage, setRoom, setShouldSendMessage } from '@src/store/slices/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import './chatroom-view.scss';
import NewMessages from './ChatroomViewNewMessages';
import OldMessages from './ChatroomViewOldMessages';
import useSocketOn from '@src/hooks/useSocketOn';
import { RoomJoinResponse } from '../../../../types';

interface ChatroomViewProps {}

const ChatroomView = ({}: ChatroomViewProps) => {
  const token = useAppSelector((s) => s.user.token);
  const navigate = useNavigate();
  const location = useLocation();
  const room = useAppSelector((s) => s.user.room);
  const dispatch = useAppDispatch();
  const { containerRef: messageContainerRef, scrollToBottom } = useScrollToBottom();

  useSocketOn('JOINED_ROOM', ({ room, preExisting }: RoomJoinResponse) => {
    dispatch(setRoom(room));
  });

  useEffect(() => {
    const room = location.pathname.split('/room/')[1];
    if (!room) navigate({ pathname: '/' });
    else socket.emit('JOIN_ROOM_REQUEST', room, token);
  }, []);

  const handleBack = () => {
    dispatch(setRoom(''));
    navigate({ pathname: '/' });
    socket.emit('LEAVE_ROOM');
  };

  if (!room) return <></>;

  const ChatRoom = () => (
    <div id='room-view' className='full-screen'>
      <div id='room-view-content' className='floating-window'>
        <div className='room-header'>
          <button onClick={handleBack} className='back-button'>
            <KeyboardArrowLeftSharpIcon className='indicator' />
          </button>
          <h1>{room}</h1>
        </div>
        <MessageContainer messageContainerRef={messageContainerRef} scrollToBottom={scrollToBottom} />
        <MessageInput />
      </div>
    </div>
  );
  if (room) return <ChatRoom />;
  else return <></>;
};

interface MessageContainerProps {
  messageContainerRef: React.RefObject<HTMLDivElement>;
  scrollToBottom: () => void;
}

const MessageContainer = ({ messageContainerRef, scrollToBottom }: MessageContainerProps) => {
  const [usernameColors, setUsernameColors] = useState<Map<string, number>>(new Map());

  return (
    <section ref={messageContainerRef} className='message-container'>
      <OldMessages
        usernameColors={usernameColors}
        setUsernameColors={setUsernameColors}
        scrollToBottom={scrollToBottom}
      />
      <NewMessages scrollToBottom={scrollToBottom} usernameColors={usernameColors} />
    </section>
  );
};

const MessageInput = () => {
  const dispatch = useAppDispatch();
  const message = useAppSelector((s) => s.user.message);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setShouldSendMessage(true));
  };

  return (
    <form spellCheck='false' autoComplete='off' className='join-room-form' onSubmit={(e) => handleSendMessage(e)}>
      <section className='message-input-container'>
        <Input
          name='message-input'
          value={message}
          onChange={(e) => {
            dispatch(setMessage(e.target.value));
          }}
        />
        <Button type='submit'>Send</Button>
      </section>
    </form>
  );
};

export default ChatroomView;
