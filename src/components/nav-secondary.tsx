'use client'

import * as React from 'react'
import type { Icon } from '@tabler/icons-react'

import type { Permissions, Role } from '@/lib/roles'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAccessControl } from '@/features/account/hooks/use-access-control'

export type NavSecondaryItem = {
  title: string
  url: string
  icon: Icon
  permission?: Permissions
  role?: Role
}

export function NavSecondary({
  items,
  ...props
}: {
  items: Array<NavSecondaryItem>
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { hasPermission, hasRole } = useAccessControl()
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
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
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
