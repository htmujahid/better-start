import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import appConfig from '@/config/app.config'

export const I18N_COOKIE_NAME = 'lang'

export const rootAction = createServerFn().handler(() => {
  const theme = getCookie('theme') ?? appConfig.theme
  const lang = getCookie(I18N_COOKIE_NAME) ?? appConfig.locale

  return {
    theme,
    lang,
  }
})
