import { createFileRoute } from '@tanstack/react-router'

import type { allRoles } from '@/lib/roles'
import { AccountRoles } from '@/features/account/components/account-roles'

export const Route = createFileRoute('/home/account/roles/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext()
  const roles = user?.role?.split(',') ?? [] as Array<keyof typeof allRoles>

  return (
    <div className='max-w-xl'>
      <AccountRoles roles={roles as Array<keyof typeof allRoles>} />
    </div>
  )
}
