import { createFileRoute } from '@tanstack/react-router'

import { AccountDangerZone } from '@/components/account/account-danger-zone'

export const Route = createFileRoute('/home/account/danger-zone/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex w-full max-w-xl flex-col space-y-4 p-4">
      <AccountDangerZone />
    </div>
  )
}
