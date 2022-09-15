import { useSocketOn } from '@src/hooks/useSocketOn';
import { useAppSelector } from '@src/store/hooks';
import { useEffect, useState } from 'react';

import { socket } from '@src/App';
import { setMessage, setShouldSendMessage } from '@src/store/slices/userSlice';
import { useDispatch } from 'react-redux';
import { ChatMessage } from '../../../../types';
import './chatroom-view.scss';
import Messages from './ChatroomViewMessages';

interface NewMessagesProps {
  usernameColors: Map<string, number>;
  scrollToBottom: () => void;
}

const NewMessages = ({ usernameColors, scrollToBottom }: NewMessagesProps) => {
  const token = useAppSelector((s) => s.user.token);
  const username = useAppSelector((s) => s.user.username);
  const color = useAppSelector((s) => s.user.color);
  const room = useAppSelector((s) => s.user.room);
  const shouldSendMessage = useAppSelector((s) => s.user.shouldSendMessage);
  const message = useAppSelector(
    (s) => s.user.message,
    () => !shouldSendMessage
  );

  const [newMessages, setNewMessages] = useState<ChatMessage[]>([]);
  const dispatch = useDispatch();

  useSocketOn('CHAT_MESSAGE', (chatMessage: ChatMessage) => {
    updateNewMessages(chatMessage);
  });

  useEffect(() => {
    if (shouldSendMessage) sendMessage();
  }, [shouldSendMessage]);

  const sendMessage = () => {
    if (!message) return;
    const chatMessage: ChatMessage = { text: message, room, username, sentDate: new Date(), color };
    socket.emit('CHAT_MESSAGE', chatMessage, token);
    updateNewMessages(chatMessage);
    dispatch(setMessage(''));
    dispatch(setShouldSendMessage(false));
  };

  const updateNewMessages = (chatMessage: ChatMessage) => {
    setNewMessages((previousMessages) => [...previousMessages, chatMessage]);
    scrollToBottom();
  };

  return <Messages chatMessages={newMessages} usernameColors={usernameColors} messageKey='new-messages' />;
};

export default NewMessages;
