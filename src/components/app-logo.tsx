import { Link } from '@tanstack/react-router'

export function AppLogo({ path }: { path?: string }) {
  return (
    <Link
      to={path ?? '/'}
      className="flex items-center gap-2 self-center font-medium"
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
        ~
      </div>
      BetterAdmin
    </Link>
  )
}
