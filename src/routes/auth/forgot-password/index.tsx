import { createFileRoute } from '@tanstack/react-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export const Route = createFileRoute('/auth/forgot-password/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password</CardTitle>
          <CardDescription>
            Reset your password to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
