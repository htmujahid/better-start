import { Link } from '@tanstack/react-router'

import { OAuthProviders } from './oauth-providers'
import { SignUpForm } from './password-sign-up-form'

export function SignUpMethodsContainer() {
  return (
    <div className="grid gap-3">
      <OAuthProviders />
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-card text-muted-foreground relative z-10 px-2">
          Or continue with
        </span>
      </div>
      <SignUpForm />
      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link to="/auth/sign-in" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </div>
  )
}
