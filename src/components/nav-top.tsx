// import { IconCirclePlusFilled, IconMail } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import type { Icon } from '@tabler/icons-react'

import type { Permissions, Role } from '@/lib/roles'
// import { Button } from '@/components/ui/button'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAccessControl } from '@/features/account/hooks/use-access-control'

export type NavTopItem = {
  title: string
  url: string
  icon?: Icon
  permission?: Permissions
  role?: Role
}

export function NavTop({ items }: { items: Array<NavTopItem> }) {
  const { hasPermission, hasRole } = useAccessControl()
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu> */}
        <SidebarMenu>
          {items.map((item) => {
            if (item.permission && !hasPermission(item.permission, 'OR')) {
              return null
            }
            if (item.role && !hasRole(item.role)) {
              return null
            }
            return (
              <SidebarMenuItem key={item.title}>
                <Link to={item.url}>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
