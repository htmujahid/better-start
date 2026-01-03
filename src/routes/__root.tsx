import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'

import { sessionAction } from '@/actions/auth/session-action'
import { rootAction } from '@/actions/root-action'

interface MyRouterContext {
  queryClient: QueryClient
}

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
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  beforeLoad: async () => {
    const data = await sessionAction()
    const root = await rootAction()

    return {
      ...data,
      ...root,
    }
  },
  shellComponent: RootDocument,
  notFoundComponent: () => <div>404 Not Found</div>,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { theme, lang } = Route.useRouteContext()

  return (
    <html lang={lang} data-theme={theme} className={theme}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
