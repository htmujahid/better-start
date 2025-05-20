import { createFileRoute } from '@tanstack/react-router'

import { UpdateAccountImage } from '@/features/account/components/update-account-image'
import { UpdateAccountDetailsForm } from '@/features/account/components/update-account-details-form'
import { UpdateAccountEmailForm } from '@/features/account/components/update-account-email-form'
import { AccountRoles } from '@/features/account/components/account-roles'
import { AccountDangerZone } from '@/features/account/components/account-danger-zone'

export const Route = createFileRoute('/home/account/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className={'flex w-full flex-col space-y-4 max-w-xl p-4'}>
      <UpdateAccountImage />
      <UpdateAccountDetailsForm />
      <UpdateAccountEmailForm />
      <AccountRoles />
      <AccountDangerZone />
    </div>
  )
}
