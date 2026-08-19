import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import uz from './locales/uz.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'uz', label: "O'zbekcha" },
  { code: 'en', label: 'English' },
];

export const STORAGE_KEY = 'it-center-language';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      uz: { translation: uz },
      en: { translation: en },
    },
    fallbackLng: 'uz',
    supportedLngs: SUPPORTED_LANGUAGES.map((language) => language.code),
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: STORAGE_KEY,
      caches: ['localStorage'],
    },
  });

export default i18n;
