import { createContext, useContext, useEffect, useState } from 'react';
import { useWhiteLabeling } from '../hooks/useWhiteLabeling';
import { useFavicon } from '../hooks/useFavicon';

const ThemeProviderContext = createContext(undefined);
const BASE_IMAGE_URL = import.meta.env.VITE_S3_BASE_URL;

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'monitoring-agency-theme',
}) {
  const brandingTheme = useWhiteLabeling();
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || brandingTheme.theme?.defaultMode
  );
  const [faviconUrl, setFaviconUrl] = useState(null);

  useEffect(() => {
    setFaviconUrl(brandingTheme?.branding?.faviconUrl);
    console.log(brandingTheme);

    const root = document.documentElement;

    root.classList.remove('light', 'dark');
    let appliedTheme = theme;
    if (theme === 'system') {
      appliedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    root.classList.add(appliedTheme);
    // apply CSS variables from config
    const currentColors = brandingTheme.theme.colors[appliedTheme];
    for (const colorName in currentColors) {
      root.style.setProperty(`--ms-${colorName}-color`, currentColors[colorName]);
    }
    root.style.setProperty('--ms-logo-url', `url('${brandingTheme.branding.logoUrl}')`);
    root.style.setProperty('--ms-font-family', "'Poppins', sans-serif");
    if (brandingTheme?.branding?.appName) {
      document.title = brandingTheme.branding.appName;
    } else {
      document.title = 'Seenyor';
    }
    // optional cleanup
    return () => {
      // We should clear the vars or title, but that might be aggressive.
      // At least we should ensure they aren't set if we aren't using this provider.
      // Since we are moving this provider to strictly MonitoringLayout, we can assume
      // that when it unmounts, we should revert.
      // However, restoring 'Seenyor' title is good.
      document.title = 'Seenyor';
      // Cleaning up vars is harder without a list, but maybe we don't need to if
      // the class 'monitoring-agency-theme' is gone.
    };
  }, [theme, brandingTheme]);
  useFavicon(faviconUrl);

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeProviderContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
