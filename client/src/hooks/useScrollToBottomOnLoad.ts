import { useEffect, useRef } from 'react';

export const useScrollToBottomOnLoad = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.scrollBehavior = '';
        scrollToBottom();
      }
    }, 20);
  }, [containerRef]);

  const scrollToBottom = () => {
    setTimeout(() => {
      containerRef.current?.scrollTo(0, containerRef?.current.scrollHeight);
      if (containerRef.current) containerRef.current.style.scrollBehavior = 'smooth';
    }, 50);
  };

  return { containerRef, scrollToBottom };
};
