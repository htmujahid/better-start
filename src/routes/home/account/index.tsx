import { createFileRoute } from '@tanstack/react-router'

import { AccountRoles } from '@/components/account/account-roles'
import { UpdateAccountDetailsForm } from '@/components/account/update-account-details-form'
import { UpdateAccountImage } from '@/components/account/update-account-image'

export const Route = createFileRoute('/home/account/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex w-full max-w-xl flex-col space-y-4 p-4">
      <UpdateAccountImage />
      <UpdateAccountDetailsForm />
      <AccountRoles />
    </div>
  )
}
