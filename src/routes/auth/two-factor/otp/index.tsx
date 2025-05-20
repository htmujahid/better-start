import { createFileRoute } from '@tanstack/react-router'
import { OtpForm } from '@/features/auth/components/otp-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/auth/two-factor/otp/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Verify your identity with a one-time password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OtpForm />
        </CardContent>
      </Card>
    </div>
  )
}
