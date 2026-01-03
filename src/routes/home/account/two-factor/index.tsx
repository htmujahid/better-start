import { createFileRoute } from '@tanstack/react-router'
import { TwoFactorContainer } from '@/components/account/two-factor-container'

export const Route = createFileRoute('/home/account/two-factor/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user, session } = Route.useRouteContext()

  return (
    <div className="flex w-full max-w-xl flex-col space-y-4 p-4">
      <TwoFactorContainer session={{ user: user!, session: session! }} />
    </div>
  )
}
