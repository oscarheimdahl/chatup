import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { loggedIn, logout } from '@src/store/slices/userSlice';
import { useEffect } from 'react';

const useLoggedIn = () => {
  const dispatch = useAppDispatch();
  const storedToken = window.localStorage.getItem('token');
  const token = useAppSelector((s) => s.user.token);

  useEffect(() => {
    if (storedToken) dispatch(loggedIn(storedToken));
    else dispatch(logout());
  }, [token, storedToken]);
};
export default useLoggedIn;
