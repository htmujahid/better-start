import { createFileRoute } from '@tanstack/react-router'

import { UpdateAccountDetailsForm } from '@/features/account/components/update-account-details-form'
import { UpdateAccountEmailForm } from '@/features/account/components/update-account-email-form'
import { UpdateAccountPasswordForm } from '@/features/account/components/update-account-password-form'

export const Route = createFileRoute('/home/account/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className={'flex w-full flex-col space-y-4 max-w-xl'}>
      <UpdateAccountDetailsForm />
      <UpdateAccountEmailForm />
      <UpdateAccountPasswordForm />
    </div>
  )
}
