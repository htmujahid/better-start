import {
  HeadContent,
  Outlet,
  ScriptOnce,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { createServerFn } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { TanstackQueryLayout } from '@/components/providers/layout'
import { RootProvider } from '@/components/providers/root-provider'
import { auth } from '@/lib/auth'

interface MyRouterContext {
  queryClient: QueryClient
}

const fetchUser = createServerFn({ method: 'GET' }).handler(async () => {
  const { headers } = getWebRequest()!
  const session = await auth.api.getSession({
    headers,
  })

  return session?.user ?? null
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
    const user = await context.queryClient.fetchQuery({
      queryKey: ['user'],
      queryFn: ({ signal }) => fetchUser({ signal }),
    })
    return { user }
  },
  component: () => (
    <RootDocument>
      <RootProvider>
        <Outlet />
      </RootProvider>
      <TanStackRouterDevtools />

      <TanstackQueryLayout />
    </RootDocument>
  ),
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ScriptOnce>
          {`document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
            )`}
        </ScriptOnce>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
