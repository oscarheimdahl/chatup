import { host } from '@src/config/vars';
import { useAppSelector } from '@src/store/hooks';
import axios from 'axios';
import { useEffect } from 'react';

export const useJwtInterceptor = () => {
  const token = useAppSelector((s) => s.user.token);
  const loggedIn = useAppSelector((s) => s.user.loggedIn);
  useEffect(() => {
    axios.interceptors.request.use((request) => {
      if (!request || !request.url || !request.headers || !request.headers.common) return;
      const isApiUrl = request.url.startsWith(host as string);
      if (loggedIn && isApiUrl) {
        request.headers.common.Authorization = `Bearer ${token}`;
      }

      return request;
    });
  }, [loggedIn, token]);
};
