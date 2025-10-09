import { useEffect, useState } from 'react';

export function useViewportWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    let timeout: number | null = null;

    const handleResize = () => {
      if (timeout) clearTimeout(timeout);
      timeout = window.setTimeout(() => setWidth(window.innerWidth), 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      if (timeout) clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return width;
}