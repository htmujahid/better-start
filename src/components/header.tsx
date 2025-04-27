import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import { AppLogo } from './app-logo'

export default function Header() {
  return (
    <header className="border-b">
      <nav className="container mx-auto flex justify-between items-center h-14">
        <AppLogo />
        <div className="flex gap-4">
          <Link to="/auth/sign-in">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link to="/auth/sign-up">
            <Button variant="default">Sign Up</Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
