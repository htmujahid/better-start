import { toast } from 'sonner'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  IconDotsVertical,
  IconLock,
  IconLogout,
  IconPalette,
  IconShield,
  IconUserCircle,
} from '@tabler/icons-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { authClient } from '@/lib/auth-client'
import pathsConfig from '@/config/paths.config'
import { useUser } from '@/features/account/hooks/use-user'

export function NavUser({ fallback }: { fallback?: React.ReactNode }) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const { user: userData, session } = useUser()

  if (!userData) {
    return fallback
  }

  const user = {
    name: userData.name,
    email: userData.email,
    avatar: userData.image,
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={userData.image ?? undefined}
                  alt={userData.name}
                />
                <AvatarFallback className="rounded-lg">
                  {userData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
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
                  <AvatarFallback className="rounded-lg">
                    {userData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
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
              <Link to={pathsConfig.app.security}>
                <DropdownMenuItem>
                  <IconShield />
                  Security
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem disabled>
                <IconPalette />
                Preferences (soon)
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {session?.impersonatedBy ? (
              <DropdownMenuItem
                onClick={async () => {
                  const { error } = await authClient.admin.stopImpersonating()

                  if (error) {
                    toast.error(error.message)
                  } else {
                    toast.success('Impersonation stopped')
                    navigate({
                      to: pathsConfig.admin.users,
                      replace: true,
                    })
                  }
                }}
              >
                <IconLock />
                Stop Impersonation
              </DropdownMenuItem>
            ) : (
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
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
