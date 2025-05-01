'use client'

import type { Icon } from '@tabler/icons-react'

import type { Permissions, Role } from '@/lib/roles'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAccessControl } from '@/features/account/hooks/use-access-control'

export type NavResourceItem = {
  name: string
  url: string
  icon: Icon
  permission?: Permissions
  role?: Role
}

export function NavResources({
  resource,
  items,
}: {
  resource: string
  items: Array<NavResourceItem>
}) {
  const { hasPermission, hasRole } = useAccessControl()
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{resource}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (item.permission && !hasPermission(item.permission, 'OR')) {
            return null
          }
          if (item.role && !hasRole(item.role)) {
            return null
          }
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
