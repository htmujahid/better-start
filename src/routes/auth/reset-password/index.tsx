import { z } from 'zod'
import { AlertCircle } from 'lucide-react'
import { Link, createFileRoute } from '@tanstack/react-router'

import { ResetPasswordForm } from '@/features/auth/components/reset-password-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export const Route = createFileRoute('/auth/reset-password/')({
  validateSearch: z.object({
    token: z.string().min(1),
  }),
  component: RouteComponent,
  errorComponent: () => <ErrorComponent />,
})

function RouteComponent() {
  const { token } = Route.useSearch()

  if (!token) {
    return <ErrorComponent />
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>
            Reset your password to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}

function ErrorComponent() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>
            Reset your password to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant={'error'} className="mb-4">
            <AlertCircle />
            <AlertTitle>Invalid token</AlertTitle>
            <AlertDescription>
              The token you provided is invalid or has expired. Please try
              again.
            </AlertDescription>
          </Alert>
          <div className="text-center text-sm">
            Want to go back?{' '}
            <Link to="/auth/sign-in" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
