import { createFileRoute } from '@tanstack/react-router'

import { AccountRoles } from '@/features/account/components/account-roles'

export const Route = createFileRoute('/home/account/roles/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="max-w-xl">
      <AccountRoles />
    </div>
  )
}
