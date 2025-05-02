'use client'

import * as React from 'react'
import { Link } from '@tanstack/react-router'

import { IconSearch } from '@tabler/icons-react'
import { SearchCommandDialog } from '../search-command-dialog'

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
  disabled?: boolean
  target?: '_blank'
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
                  <Link to={item.url} target={item.target}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
          <SearchCommandDialog>
            {({ open, setOpen }) => (
              <SidebarMenuItem
                className="bg-sidebar"
                onClick={() => setOpen(!open)}
              >
                <SidebarMenuButton>
                  <IconSearch />
                  <span>Search</span>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-auto">
                    <span className="text-xs">⌘</span>J
                  </kbd>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SearchCommandDialog>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
