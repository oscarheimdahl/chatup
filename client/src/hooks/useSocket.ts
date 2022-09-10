import { ClientToServerEvents, ServerToClientEvents } from '@src/../../types/emits';
import { host } from '@src/config/vars';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(host as string);
const useSocket = () => {
  // @ts-ignore
  const [socketConnected, setSocketConnected] = useState(false);
  const token = useAppSelector((s) => s.user.token);
  // TODO THIS DOESNT WORK
  useEffect(() => {
    if (socketConnected) return;
    socket.auth = { token };
    socket.connect();
    setSocketConnected(true);
  }, [socketConnected]);
  return socket;
};

export default useSocket;
