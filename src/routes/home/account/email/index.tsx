import { createFileRoute } from '@tanstack/react-router'

import { UpdateAccountEmailForm } from '@/components/account/update-account-email-form'

export const Route = createFileRoute('/home/account/email/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex w-full max-w-xl flex-col space-y-4 p-4">
      <UpdateAccountEmailForm />
    </div>
  )
}
