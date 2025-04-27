import { Link } from '@tanstack/react-router'

export function AppLogo() {
  return (
    <Link to="/" className="flex items-center gap-2 self-center font-medium">
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
        ~
      </div>
      BetterAdmin
    </Link>
  )
}
