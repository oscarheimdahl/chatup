import { useEffect } from 'react';

import { socket } from '@src/App';

export const useSocketOn = (event: Parameters<typeof socket.on>[0], action: Parameters<typeof socket.on>[1]) => {
  useEffect(() => {
    socket.on(event, action);
    return () => {
      socket.off(event, action);
    };
  }, []);
};

export default useSocketOn;
