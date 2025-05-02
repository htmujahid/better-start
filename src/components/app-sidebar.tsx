import * as React from 'react'

import {
  navDocumentsData,
  navResourceShopData,
  navSecondaryData,
  navTopData,
} from './sidebar/sidebar-data'

import { AppLogo } from '@/components/app-logo'
import { NavTop } from '@/components/sidebar/nav-top'
import { NavResources } from '@/components/sidebar/nav-resources'
import { NavSecondary } from '@/components/sidebar/nav-secondary'
import { NavDocuments } from '@/components/sidebar/nav-documents'
import { NavUser } from '@/components/sidebar/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <AppLogo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavTop items={navTopData} />
        {/* <NavMain items={navMainData} /> */}
        <NavResources resource="Shop" items={navResourceShopData} />
        <NavDocuments items={navDocumentsData} />
        <NavSecondary items={navSecondaryData} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
