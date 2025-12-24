import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export const useTranslation = () => {
  const languageContext = useLanguage();
  const currentLanguage = languageContext?.currentLanguage || 'ru';

  const t = (key, values = {}) => {
    // Debug logging
    if (!translations) {
      console.error('Translations not loaded');
      return key;
    }
    
    if (!translations[currentLanguage]) {
      console.error(`Translations for language '${currentLanguage}' not found`);
      return key;
    }

    let translation = translations[currentLanguage]?.[key];
    
    // Fallback: if translation not found, try the other language
    if (!translation) {
      const fallbackLang = currentLanguage === 'ru' ? 'en' : 'ru';
      translation = translations[fallbackLang]?.[key];
    }
    
    // If still no translation, return the key
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${currentLanguage}`);
      return key;
    }
    
    // Replace template variables like {{points}} with actual values
    if (typeof translation === 'string' && Object.keys(values).length > 0) {
      Object.keys(values).forEach(variable => {
        const regex = new RegExp(`{{${variable}}}`, 'g');
        translation = translation.replace(regex, values[variable]);
      });
    }
    
    return translation;
  };

  return { t };
}; 