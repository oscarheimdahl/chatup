import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { loggedIn, logout } from '@src/store/slices/userSlice';
import { useEffect } from 'react';

import { ClientToServerEvents, ServerToClientEvents } from '@src/../../types/emits';
import { host } from '@src/config/vars';
import { io, Socket } from 'socket.io-client';

const useLoggedIn = () => {
  const dispatch = useAppDispatch();
  const storedToken = window.localStorage.getItem('token');
  const token = useAppSelector((s) => s.user.token);

  useEffect(() => {
    // alert();

    if (!storedToken) dispatch(logout());
    else {
      dispatch(loggedIn(storedToken));
    }
  }, []);
};
export default useLoggedIn;
