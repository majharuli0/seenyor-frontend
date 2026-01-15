import { useEffect } from 'react';

/**
 * Dynamically sets favicon from a given URL.
 * Falls back to a default favicon from /public if not provided or fails to load.
 *
 * @param {string | null} iconUrl - The URL of the favicon (from API or remote source)
 * @param {string} defaultFavicon - Path to default favicon (default: '/favicon.png')
 */
const BASE_IMAGE_URL = import.meta.env.VITE_S3_BASE_URL;

export function useFavicon(iconUrl, defaultFavicon = '/vite.png') {
  useEffect(() => {
    if (!iconUrl) {
      setFavicon(defaultFavicon);
      return;
    }

    const img = new Image();
    img.onload = () => setFavicon(BASE_IMAGE_URL + iconUrl);
    img.onerror = () => setFavicon(defaultFavicon);
    img.src = BASE_IMAGE_URL + iconUrl;

    return () => removeExistingFavicons();
  }, [iconUrl, defaultFavicon]);
}

function removeExistingFavicons() {
  const existingIcons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
  existingIcons.forEach((icon) => icon.parentNode.removeChild(icon));
}

function setFavicon(url) {
  removeExistingFavicons();

  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/png';
  favicon.href = url;

  document.head.appendChild(favicon);
}
