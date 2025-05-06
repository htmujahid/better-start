import { createServerFn } from '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'
import { getCookie, getWebRequest } from '@tanstack/react-start/server'

import { auth } from '@/lib/auth'
import { AccountSessions } from '@/features/account/components/account-sessions'

const fetchSessions = createServerFn({ method: 'GET' }).handler(async () => {
  const { headers } = getWebRequest()!

  const sessionToken = getCookie('better-auth.session_token') as string

  const sessionId = sessionToken?.split('.')[0]

  const sessions = await auth.api.listSessions({
    headers,
  })
  return {
    sessions,
    sessionId,
  }
})

export const Route = createFileRoute('/home/account/sessions/')({
  beforeLoad: async ({ context }) => {
    return context?.queryClient.fetchQuery({
      queryKey: ['sessions'],
      queryFn: ({ signal }) => fetchSessions({ signal }),
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { sessions, sessionId } = Route.useRouteContext()

  return (
    <div className="max-w-xl">
      <AccountSessions sessions={sessions} sessionId={sessionId} />
    </div>
  )
}
