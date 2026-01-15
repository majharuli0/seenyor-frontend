import { create } from 'zustand';

import defaultConfig from '../conf.json';

export const useBrandingStore = create((set, get) => ({
  branding: defaultConfig.branding,
  theme: defaultConfig.theme,

  initBranding: () => {
    try {
      const cached = localStorage.getItem('branding_data');

      if (cached) {
        const parsed = JSON.parse(cached);
        set({
          branding: parsed.branding || defaultConfig.branding,
          theme: parsed.theme || defaultConfig.theme,
        });

        return parsed;
      }
    } catch (error) {
      console.warn('Branding cache read failed:', error);
    }

    set({
      branding: defaultConfig.branding,
      theme: defaultConfig.theme,
    });
    return defaultConfig;
  },

  setBranding: (branding, theme) => {
    const data = {
      branding: branding || defaultConfig.branding,
      theme: theme || defaultConfig.theme,
    };
    localStorage.setItem('branding_data', JSON.stringify(data));
    set(data);
  },

  clearBranding: () => {
    localStorage.removeItem('branding_data');
    set({
      branding: defaultConfig.branding,
      theme: defaultConfig.theme,
    });
  },
}));
