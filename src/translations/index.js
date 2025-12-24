import { en } from './en';
import { ru } from './ru';

export const translations = {
  en,
  ru
};

export const getTranslation = (language, key) => {
  return translations[language]?.[key] || translations.en[key] || key;
}; 