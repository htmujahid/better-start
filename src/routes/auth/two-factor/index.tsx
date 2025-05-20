import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TwoFactorForm } from '@/features/auth/components/two-factor-form'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/two-factor/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>TOTP Verification</CardTitle>
          <CardDescription>
            Enter your 6-digit TOTP code to authenticate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TwoFactorForm />
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground gap-2">
          <Link to="/auth/two-factor/otp">
            <Button variant="link" size="sm">
              Switch to Email Verification
            </Button>
          </Link>
        </CardFooter>
      </Card>    
    </div>
  )
}
