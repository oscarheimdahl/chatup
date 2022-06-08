import { useEffect, useState } from 'react';
import './dots-background.scss';

const DotsBackground = () => {
  const [n, setN] = useState(0);

  useEffect(() => {
    const updateDots = () => {
      const xDots = Math.floor(window.innerWidth / 100);
      const yDots = Math.floor(window.innerHeight / 100);

      setN(xDots * yDots);
    };
    window.addEventListener('resize', updateDots);
    updateDots();
    return () => {
      window.removeEventListener('resize', updateDots);
    };
  }, []);

  return (
    <div id='dots-background'>
      <div className='dots'>
        {[...Array(n)].map((_, i) => {
          return (
            <div key={i} className='dot-container'>
              <div key={i} className='dot'></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DotsBackground;
