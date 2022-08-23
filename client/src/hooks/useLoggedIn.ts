import { useAppDispatch } from '@src/store/hooks';
import { loggedIn, logout } from '@src/store/slices/userSlice';
import { useEffect } from 'react';

const useLoggedIn = () => {
  const dispatch = useAppDispatch();
  const token = window.localStorage.getItem('token');

  useEffect(() => {
    if (token) dispatch(loggedIn(token));
    else dispatch(logout());
  }, []);
};
export default useLoggedIn;
