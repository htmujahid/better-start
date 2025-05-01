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

interface MyRouterContext {
  queryClient: QueryClient
}

const DEFAULT_THEME = 'light'

const fetchRootData = createServerFn({ method: 'GET' }).handler(async () => {
  const { headers } = getWebRequest()!
  const session = await auth.api.getSession({
    headers,
  })

  const cookies = getCookie('theme') as 'light' | 'dark' | undefined

  return {
    user: session?.user ?? null,
    theme: cookies ?? DEFAULT_THEME,
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
    const data = await context.queryClient.fetchQuery({
      queryKey: ['user'],
      queryFn: ({ signal }) => fetchRootData({ signal }),
    })
    return { user: data.user, theme: data.theme }
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
  const { theme } = Route.useRouteContext()

  return (
    <html lang="en" className={theme}>
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
