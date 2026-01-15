import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    }); // Scrolls to the top of the page when the route changes
  }, [pathname]);

  return null;
}

export default ScrollToTop;
