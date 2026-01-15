import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    const savedLang = localStorage.getItem('lang');
    const defaultLang = 'en';

    const activeLang = urlLang || savedLang || defaultLang;

    if (!savedLang) localStorage.setItem('lang', defaultLang);

    setLanguage(activeLang);
    i18n.changeLanguage(activeLang);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('lang', lang);
    i18n.changeLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
