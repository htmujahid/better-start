import { Link, createFileRoute } from '@tanstack/react-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SignUpMethodsContainer } from '@/components/auth/sign-up-methods-container'

export const Route = createFileRoute('/auth/sign-up/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Sign up to create an account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpMethodsContainer />
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{' '}
        <Link to="/">Terms of Service</Link> and{' '}
        <Link to="/">Privacy Policy</Link>.
      </div>
    </div>
  )
}
