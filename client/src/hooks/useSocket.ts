import { ClientToServerEvents, ServerToClientEvents } from '@src/../../types/emits';
import { host } from '@src/config/vars';
import { useAppSelector } from '@src/store/hooks';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = () => {
  // @ts-ignore
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>(null);
  const token = useAppSelector((s) => s.user.token);

  useEffect(() => {
    const ioSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(host as string, {
      auth: { token },
      autoConnect: true,
    });
    ioSocket.connect();
    setSocket(ioSocket);
    ioSocket.on('INVALID_TOKEN', () => console.log('bad token'));
  }, []);

  return socket;
};

export default useSocket;
