import { AccountSessions } from '@/features/account/components/account-sessions'
import { TwoFactorContainer } from '@/features/account/components/two-factor-container'
import { UpdateAccountPasswordForm } from '@/features/account/components/update-account-password-form'
import { createFileRoute } from '@tanstack/react-router'
import { getCookie } from '@tanstack/react-start/server'
import { createServerFn } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'

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

export const Route = createFileRoute('/home/security/')({
  beforeLoad: async ({ context }) => {
    return context?.queryClient.fetchQuery({
      queryKey: ['sessions'],
      queryFn: ({ signal }) => fetchSessions({ signal }),
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user, session, sessions, sessionId } = Route.useRouteContext()

  return (
    <div className={'flex w-full flex-col space-y-4 max-w-xl p-4'}>
      <UpdateAccountPasswordForm />
      <AccountSessions sessionId={sessionId} sessions={sessions} />
      <TwoFactorContainer session={{user: user!, session: session!}} />
    </div>
  )
}
