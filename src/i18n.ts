import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import fr from './locales/fr.json'

const STORAGE_KEY = 'prisme_lng'
const saved = localStorage.getItem(STORAGE_KEY)
const lng = saved === 'fr' ? 'fr' : 'en'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
export { STORAGE_KEY }
