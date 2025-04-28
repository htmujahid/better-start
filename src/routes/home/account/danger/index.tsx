import { createFileRoute } from '@tanstack/react-router'
import { AccountDangerZone } from '@/features/account/components/account-danger-zone'

export const Route = createFileRoute('/home/account/danger/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='max-w-xl'>
      <AccountDangerZone />
    </div>
  )
}
