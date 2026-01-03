import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import { Home, LogOut, MenuIcon, Shield, User } from 'lucide-react'
import { ThemeToggle } from '../misc/theme-toggle'
import { AppLogo } from '@/components/app-logo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useUser } from '@/hooks/use-user'
import { authClient } from '@/lib/auth-client'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useUser()

  const handleSignOut = async () => {
    await authClient.signOut()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <AppLogo />
        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/home">
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/home/account">
                      <User className="mr-2 h-4 w-4" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/home/account/security">
                      <Shield className="mr-2 h-4 w-4" />
                      Security
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/home">
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/home/account">
                      <User className="mr-2 h-4 w-4" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/home/account/security">
                      <Shield className="mr-2 h-4 w-4" />
                      Security
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost">
                  <MenuIcon className="size-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 p-4">
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link
                        to="/auth/sign-in"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link
                        to="/auth/sign-up"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}
