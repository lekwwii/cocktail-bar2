import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources
import cs from './locales/cs.json';
import en from './locales/en.json';
import ru from './locales/ru.json';
import uk from './locales/uk.json';

const resources = {
  cs: { translation: cs },
  en: { translation: en },
  ru: { translation: ru },
  uk: { translation: uk }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'cs',
    debug: false,
    
    interpolation: {
      escapeValue: false // React already escapes by default
    },
    
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie']
    }
  });

export default i18n;