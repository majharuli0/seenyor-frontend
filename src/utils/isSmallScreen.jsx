import { useState, useEffect } from 'react';

/**
 * useIsSmallScreen hook
 * @param {number} breakpoint - width in px to compare (default 1400)
 * @returns {boolean} true if window width < breakpoint
 */
export function useIsSmallScreen(breakpoint = 1400) {
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < breakpoint);
    };

    // Check on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isSmallScreen;
}
