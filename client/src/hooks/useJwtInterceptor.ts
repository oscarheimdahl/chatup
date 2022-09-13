import { host } from '@src/config/vars';
import { useAppSelector } from '@src/store/hooks';
import axios, { AxiosRequestConfig } from 'axios';
import { useEffect } from 'react';

export const useJwtInterceptor = () => {
  const loggedIn = useAppSelector((s) => s.user.loggedIn);

  useEffect(() => {
    const interceptorNum = axios.interceptors.request.use((request: AxiosRequestConfig<any>) => {
      if (!request || !request.url || !request.headers || !request.headers.common) return;
      const isApiUrl = request.url.startsWith(host as string);
      if (loggedIn && isApiUrl) {
        // @ts-ignore
        request.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}`;
      }
      return request;
    });

    return () => {
      axios.interceptors.request.eject(interceptorNum);
    };
  }, [loggedIn]);
};
