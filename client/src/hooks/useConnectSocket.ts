import { socket } from '@src/App';
import { useEffect } from 'react';
import { useAppSelector } from '@src/store/hooks';

const useConnectOnLogin = () => {
  const token = useAppSelector((s) => s.user.token);
  const loggedIn = useAppSelector((state) => state.user.loggedIn);

  useEffect(() => {
    addEventListener('focus', connect);
    return () => removeEventListener('focus', connect);
  }, []);

  useEffect(() => {
    socket.auth = { token };
  }, [token]);

  useEffect(() => {
    connect();
  }, [loggedIn]);

  const connect = () => {
    if (socket.disconnected && loggedIn) socket.connect();
  };
};

export default useConnectOnLogin;
