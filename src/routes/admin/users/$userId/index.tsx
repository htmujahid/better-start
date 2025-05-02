import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'
import { getCookie, getWebRequest } from '@tanstack/react-start/server'

import { auth } from '@/lib/auth'
import { UserSessions } from '@/features/admin/components/user-sessions'

const fetchSessions = createServerFn({ method: 'GET' })
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    const { headers } = getWebRequest()!

    const sessionToken = getCookie('better-auth.session_token') as string

    const sessionId = sessionToken?.split('.')[0]

    const { sessions } = await auth.api.listUserSessions({
      headers,
      body: data,
    })

    return {
      sessions,
      sessionId,
    }
  })

export const Route = createFileRoute('/admin/users/$userId/')({
  beforeLoad: async ({ context, params }) => {
    const { sessions, sessionId } = await context.queryClient.fetchQuery({
      queryKey: ['sessions'],
      queryFn: ({ signal }) =>
        fetchSessions({ signal, data: { userId: params.userId } }),
    })
    return { sessions, sessionId }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = Route.useParams()
  const { sessions, sessionId } = Route.useRouteContext()

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="max-w-xl">
        <UserSessions
          sessions={sessions}
          sessionId={sessionId}
          userId={userId}
        />
      </div>
    </div>
  )
}
