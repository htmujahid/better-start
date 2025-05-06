import type { InitOptions } from 'i18next'

import appConfig from '@/config/app.config'

const fallbackLng = appConfig.locale ?? 'en'
const languages: Array<string> = [fallbackLng]

export const I18N_COOKIE_NAME = 'lang'

/**
 * The default array of Internationalization (i18n) namespaces.
 * These namespaces are commonly used in the application for translation purposes.
 *
 * Add your own namespaces here
 **/
export const defaultI18nNamespaces = ['common', 'auth', 'accounts', 'tasks']

export function getI18nSettings(
  language?: string,
  ns: string | Array<string> = defaultI18nNamespaces,
): InitOptions {
  let lng = language ?? fallbackLng

  if (!languages.includes(lng)) {
    console.warn(
      `Language "${lng}" is not supported. Falling back to "${fallbackLng}"`,
    )

    lng = fallbackLng
  }

  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultI18nNamespaces,
    defaultNS: defaultI18nNamespaces,
    ns,
  }
}
