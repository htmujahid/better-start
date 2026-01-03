import { createFileRoute } from '@tanstack/react-router'

import { UserSessions } from '@/components/admin/user-sessions'
import { listUserSessionsAction } from '@/actions/admin/list-user-sessions-action'

export const Route = createFileRoute('/admin/users/$userId/')({
  beforeLoad: async ({ context, params }) => {
    return context?.queryClient.fetchQuery({
      queryKey: ['sessions'],
      queryFn: ({ signal }) =>
        listUserSessionsAction({ signal, data: { userId: params.userId } }),
    })
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
