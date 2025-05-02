import { Link, useNavigate } from '@tanstack/react-router'
import {
  IconLogout,
  IconNotification,
  IconPalette,
  IconUserCircle,
} from '@tabler/icons-react'
import { Button } from './ui/button'
import { AppLogo } from './app-logo'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

import { useUser } from '@/features/account/hooks/use-user'
import pathsConfig from '@/config/paths.config'
import { authClient } from '@/lib/auth-client'

export function Header() {
  const { user } = useUser()

  return (
    <header className="border-b">
      <nav className="container mx-auto flex justify-between items-center h-14">
        <AppLogo />
        {user ? (
          <UserDropdown
            userData={{
              image: user.image ?? '',
              name: user.name,
              email: user.email,
            }}
          />
        ) : (
          <div className="flex gap-4">
            <div className="flex gap-4">
              <Link to="/auth/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/auth/sign-up">
                <Button variant="default">Sign Up</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

function UserDropdown({
  userData,
}: {
  userData: {
    image: string
    name: string
    email: string
  }
}) {
  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 rounded-lg grayscale cursor-pointer">
          <AvatarImage src={userData.image ?? undefined} alt={userData.name} />
          <AvatarFallback className="rounded-lg">
            {userData.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={userData.image ?? undefined}
                alt={userData.name}
              />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{userData.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {userData.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to={pathsConfig.app.account}>
            <DropdownMenuItem>
              <IconUserCircle />
              Account
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem disabled>
            <IconPalette />
            Preferences (soon)
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <IconNotification />
            Notifications (soon)
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={async () => {
            await authClient.signOut()
            navigate({
              to: pathsConfig.auth.signIn,
              replace: true,
            })
          }}
        >
          <IconLogout />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
