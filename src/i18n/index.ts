import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import tr from './locales/tr.json';

const resources = {
  en: { translation: en },
  tr: { translation: tr },
};

// Expo Localization v15+ kullanımı:
// Localization.getLocales() bir dizi döner, en tercih edilen dil ilktir.
// languageCode 'en', 'tr' gibi döner.
const locale = Localization.getLocales()[0];
const languageCode = locale?.languageCode ?? 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: languageCode, // Telefonun dilini al
    fallbackLng: 'en', // Bulamazsa İngilizce kullan
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false // React Native'de suspense sorun çıkarabilir
    }
  });

export default i18n;

