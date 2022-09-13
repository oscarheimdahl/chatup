import useSocket from '@src/hooks/useSocket';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { useEffect, useState } from 'react';

import KeyboardArrowLeftSharpIcon from '@mui/icons-material/KeyboardArrowLeftSharp';
import Button from '@src/components/Button/Button';
import Input from '@src/components/Input/Input';
import { useScrollToBottom } from '@src/hooks/useScrollToBottomOnLoad';
import { setMessage, setRoom, setShouldSendMessage } from '@src/store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import './chatroom-view.scss';
import NewMessages from './ChatroomViewNewMessages';
import OldMessages from './ChatroomViewOldMessages';

interface ChatroomViewProps {}

const ChatroomView = ({}: ChatroomViewProps) => {
  const navigate = useNavigate();
  const room = useAppSelector((s) => s.user.room);
  const dispatch = useAppDispatch();
  const { containerRef: messageContainerRef, scrollToBottom } = useScrollToBottom();

  useEffect(() => {
    if (!room) navigate({ pathname: '/' });
  }, []);

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
        <MessageContainer messageContainerRef={messageContainerRef} scrollToBottom={scrollToBottom} />
        <MessageInput />
      </div>
    </div>
  );
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
