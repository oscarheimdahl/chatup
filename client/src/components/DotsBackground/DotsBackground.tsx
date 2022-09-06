import { useEffect, useState } from 'react';
import ConstructionBanner from '../ConstructionBanner/ConstructionBanner';
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
      <ConstructionBanner />
      <div className='dots'>
        {[...Array(n)].map((_, i) => {
          const animDur = Math.floor(Math.random() * 20 + 15);
          const animDelay = Math.floor(Math.random() * animDur);

          return (
            <div key={i} className='dot-container'>
              {/* <div key={i} className='dot'></div> */}
              <svg viewBox='0 0 100 100'>
                <ellipse
                  style={{ animationDuration: animDur + 's', animationDelay: `-${animDelay}s` }}
                  className={`dot ${floatType()}`}
                  cx='50'
                  cy='50'
                  rx='6'
                  ry='6'
                />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const floatType = () => {
  const rand = Math.random();
  if (rand < 0.2) return 'float1';
  else if (rand < 0.6) return 'float2';
  else if (rand < 0.7) return 'float3';
  return '';
};

export default DotsBackground;
