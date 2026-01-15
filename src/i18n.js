import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true';

const API_BASE_URL = 'http://localhost:3001/';

// const API_BASE_URL =
//   import.meta.env.VITE_APP_BASE_API_V1 || "http://localhost:3001/";

i18n
  .use(initReactI18next)
  .use(HttpBackend)
  .init({
    lng: localStorage.getItem('lang') || 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: USE_BACKEND ? `${API_BASE_URL}{{lng}}` : `/locales/{{lng}}/translation.json`,

      parse: (data) => {
        try {
          return JSON.parse(data);
        } catch (e) {
          console.error('Failed to parse translation:', e);
          return {};
        }
      },
    },
    initImmediate: false,
  });

i18n.on('failedLoading', (lng, ns, msg) => {
  console.warn(`Failed to load "${lng}" from backend. Falling back to local files...`);
  i18n.reloadResources(lng);
});

export default i18n;
