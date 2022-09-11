import { useRef } from 'react';

export const useScrollToBottom = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      containerRef.current?.scrollTo(0, containerRef?.current.scrollHeight);
      if (containerRef.current) containerRef.current.style.scrollBehavior = 'smooth';
    }, 50);
  };

  return { containerRef, scrollToBottom };
};
