import { createFileRoute } from '@tanstack/react-router'
import { sessionsAction } from '@/actions/auth/sessions-action'
import { AccountSessions } from '@/components/account/account-sessions'
import { UpdateAccountPasswordForm } from '@/components/account/update-account-password-form'

export const Route = createFileRoute('/home/account/security/')({
  beforeLoad: async ({ context }) => {
    return context?.queryClient.fetchQuery({
      queryKey: ['sessions'],
      queryFn: ({ signal }) => sessionsAction({ signal }),
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { sessions, sessionId } = Route.useRouteContext()

  return (
    <div className="flex w-full max-w-xl flex-col space-y-4 p-4">
      <UpdateAccountPasswordForm />
      <AccountSessions sessionId={sessionId} sessions={sessions} />
    </div>
  )
}
