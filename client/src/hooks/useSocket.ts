import { ClientToServerEvents, ServerToClientEvents } from '@src/../../types/emits';
import { host } from '@src/config/vars';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(host as string);
const useSocket = () => {
  const token = useAppSelector((s) => s.user.token);

  useEffect(() => {
    socket.auth = { token };
    socket.connect();

    const reconnectTimeout = setTimeout(() => {
      if (socket.disconnected) socket.connect();
    }, 5000);
    return () => clearTimeout(reconnectTimeout);
  }, [token]);

  return socket;
};

export const useSocketOn = (event: Parameters<typeof socket.on>[0], action: Parameters<typeof socket.on>[1]) => {
  const socket = useSocket();
  useEffect(() => {
    socket.on(event, action);
    return () => {
      socket.off(event, action);
    };
  }, []);
};

export default useSocket;
