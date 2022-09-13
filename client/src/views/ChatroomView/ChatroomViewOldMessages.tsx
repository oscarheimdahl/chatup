import { useSocketOn } from '@src/hooks/useSocket';
import { useAppSelector } from '@src/store/hooks';
import { useEffect, useState } from 'react';

import { host } from '@src/config/vars';
import axios from 'axios';
import { ChatMessage } from '../../../../types';
import './chatroom-view.scss';
import Messages from './ChatroomViewMessages';

interface OldMessagesProps {
  scrollToBottom: () => void;
  setUsernameColors: React.Dispatch<React.SetStateAction<Map<string, number>>>;
  usernameColors: Map<string, number>;
}

const OldMessages = ({ scrollToBottom, setUsernameColors, usernameColors }: OldMessagesProps) => {
  const room = useAppSelector((s) => s.user.room);
  const ownUsername = useAppSelector((s) => s.user.username);
  const ownColor = useAppSelector((s) => s.user.color);
  const [oldMessages, setOldMessages] = useState<ChatMessage[]>([]);
  const [showMessages, setShowMessages] = useState(false);

  useEffect(() => {
    getUsersInRoom();
  }, []);

  useEffect(() => {
    const getOldMessages = async () => {
      const res = await axios.get(host + `chatroom/${room}/messages`);
      setOldMessages(res.data);
      scrollToBottom();
      setTimeout(() => setShowMessages(true), 0);
    };
    getOldMessages();
  }, []);

  useSocketOn('OTHER_JOINED_ROOM', (user: { username: string; color: number }) => {
    const { username, color } = user;
    const oldColor = usernameColors.get(username);
    if (oldColor !== color) {
      setUsernameColors((prevUsernameColors) => {
        const nextUsernameColors = new Map(prevUsernameColors);
        nextUsernameColors.set(username, color);
        return nextUsernameColors;
      });
    }
  });

  const getUsersInRoom = async () => {
    const res = await axios.get(host + `chatroom/${room}/users`);
    const users: { username: string; color: number }[] = res.data;
    const roomUsersMap = new Map<string, number>();
    users.map((user) => roomUsersMap.set(user.username, user.color));
    roomUsersMap.set(ownUsername, ownColor);
    setUsernameColors(roomUsersMap);
  };

  return (
    <div className='message-sub-container' style={{ opacity: showMessages ? 1 : 0 }}>
      <Messages chatMessages={oldMessages} usernameColors={usernameColors} messageKey='old-messages' />
    </div>
  );
};

export default OldMessages;
