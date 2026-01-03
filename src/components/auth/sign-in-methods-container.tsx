import { Link } from '@tanstack/react-router'

import { OAuthProviders } from './oauth-providers'
import { SignInForm } from './password-sign-in-form'

export function SignInMethodsContainer() {
  return (
    <div className="grid gap-3">
      <OAuthProviders />
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-card text-muted-foreground relative z-10 px-2">
          Or continue with
        </span>
      </div>
      <SignInForm />
      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link to="/auth/sign-up" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </div>
  )
}
