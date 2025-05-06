import i18next from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

import { initReactI18next } from 'react-i18next'
import { I18N_COOKIE_NAME, getI18nSettings } from './i18n.settings'

const settings = getI18nSettings()

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend((language: string, namespace: string) => {
      return import(`./locales/${language}/${namespace}.json`)
    }),
  )
  .use(LanguageDetector)
  .init({
    ...settings,
    detection: {
      order: ['htmlTag', 'cookie', 'navigator'],
      caches: ['cookie'],
      lookupCookie: I18N_COOKIE_NAME,
    },
    interpolation: {
      escapeValue: false,
    },
  })
