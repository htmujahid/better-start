'use client'

import { ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Permissions, Role } from '@/lib/roles'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { useAccessControl } from '@/features/account/hooks/use-access-control'

export type NavMainItem = {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: Array<{
    title: string
    url: string
    role?: Role
    permission?: Permissions
  }>
  permission?: Permissions
  role?: Role
}

export function NavMain({ items }: { items: Array<NavMainItem> }) {
  const { hasPermission, hasRole } = useAccessControl()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (item.permission && !hasPermission(item.permission, 'OR')) {
            return null
          }
          if (item.role && !hasRole(item.role)) {
            return null
          }
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      if (
                        subItem.permission &&
                        !hasPermission(subItem.permission, 'OR')
                      ) {
                        return null
                      }
                      if (subItem.role && !hasRole(subItem.role)) {
                        return null
                      }
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
