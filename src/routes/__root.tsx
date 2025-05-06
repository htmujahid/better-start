import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { createServerFn } from '@tanstack/react-start'
import { getCookie, getWebRequest } from '@tanstack/react-start/server'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { RootProvider } from '@/components/providers/root-provider'
import { auth } from '@/lib/auth'
import { I18N_COOKIE_NAME } from '@/lib/i18n/i18n.settings'
import appConfig from '@/config/app.config'

import '@/lib/i18n'

interface MyRouterContext {
  queryClient: QueryClient
}

const fetchRootData = createServerFn({ method: 'GET' }).handler(async () => {
  const { headers } = getWebRequest()!
  const response = await auth.api.getSession({
    headers,
  })

  const cookies = getCookie('theme') as 'light' | 'dark' | undefined
  const lang = getCookie(I18N_COOKIE_NAME)

  return {
    session: response?.session ?? null,
    user: response?.user ?? null,
    theme: cookies ?? appConfig.theme,
    lang: lang ?? appConfig.locale,
  }
})

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Better Admin',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  beforeLoad: async ({ context }) => {
    return context.queryClient.fetchQuery({
      queryKey: ['user'],
      queryFn: ({ signal }) => fetchRootData({ signal }),
    })
  },
  component: () => (
    <RootDocument>
      <RootProvider>
        <Outlet />
      </RootProvider>
      <TanStackRouterDevtools />

      <ReactQueryDevtools buttonPosition="bottom-right" />
    </RootDocument>
  ),
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { theme, lang } = Route.useRouteContext()

  return (
    <html lang={lang} className={theme}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
