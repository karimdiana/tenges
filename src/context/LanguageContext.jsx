import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Get language from localStorage or default to Russian
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const saved = localStorage.getItem('preferredLanguage');
    return saved || 'ru';
  });

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('preferredLanguage', currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (lang) => {
    if (lang === 'en' || lang === 'ru') {
      setCurrentLanguage(lang);
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    isRussian: currentLanguage === 'ru',
    isEnglish: currentLanguage === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 