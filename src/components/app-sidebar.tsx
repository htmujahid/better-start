import * as React from 'react'
// import {
//   BookOpen,
//   Bot,
//   Settings2,
//   SquareTerminal,
// } from 'lucide-react'
import {
  // IconClipboardList,
  IconDashboard,
  // IconDatabase,
  // IconFile,
  IconHelp,
  IconListDetails,
  IconPackage,
  IconSearch,
  IconTable,
  IconUsers,
} from '@tabler/icons-react'

import type { NavTopItem } from '@/components/nav-top'
// import type { NavMainItem } from '@/components/nav-main'
// import type { NavDocumentItem } from '@/components/nav-documents'
import type { NavSecondaryItem } from '@/components/nav-secondary'
import type { NavResourceItem } from '@/components/nav-resources'

import { AppLogo } from '@/components/app-logo'
import { NavTop } from '@/components/nav-top'
// import { NavMain } from '@/components/nav-main'
// import { NavDocuments } from '@/components/nav-documents'
import { NavResources } from '@/components/nav-resources'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const navTopData: Array<NavTopItem> = [
  {
    title: 'Dashboard',
    url: '/home',
    icon: IconDashboard,
  },
  {
    title: 'Admin Dashboard',
    url: '/admin',
    icon: IconDashboard,
    role: 'admin',
  },
  {
    title: 'Tasks',
    url: '/home/tasks',
    icon: IconListDetails,
    permission: { task: ['read'] },
  },
]

// const navMainData: Array<NavMainItem> = [
//   {
//     title: 'Playground',
//     url: '#',
//     icon: SquareTerminal,
//     isActive: false,
//     items: [
//       {
//         title: 'History',
//         url: '#',
//       },
//       {
//         title: 'Starred',
//         url: '#',
//       },
//       {
//         title: 'Settings',
//         url: '#',
//       },
//     ],
//   },
//   {
//     title: 'Models',
//     url: '#',
//     icon: Bot,
//     items: [
//       {
//         title: 'Genesis',
//         url: '#',
//       },
//       {
//         title: 'Explorer',
//         url: '#',
//       },
//       {
//         title: 'Quantum',
//         url: '#',
//       },
//     ],
//   },
//   {
//     title: 'Documentation',
//     url: '#',
//     icon: BookOpen,
//     items: [
//       {
//         title: 'Introduction',
//         url: '#',
//       },
//       {
//         title: 'Get Started',
//         url: '#',
//       },
//       {
//         title: 'Tutorials',
//         url: '#',
//       },
//       {
//         title: 'Changelog',
//         url: '#',
//       },
//     ],
//   },
//   {
//     title: 'Settings',
//     url: '#',
//     icon: Settings2,
//     items: [
//       {
//         title: 'General',
//         url: '#',
//       },
//       {
//         title: 'Team',
//         url: '#',
//       },
//       {
//         title: 'Billing',
//         url: '#',
//       },
//       {
//         title: 'Limits',
//         url: '#',
//       },
//     ],
//   },
// ]

const navResourceShopData: Array<NavResourceItem> = [
  {
    name: 'Products',
    url: '#',
    icon: IconTable,
  },
  {
    name: 'Orders',
    url: '#',
    icon: IconPackage,
  },
  {
    name: 'Customers',
    url: '#',
    icon: IconUsers,
  },
]

const navSecondaryData: Array<NavSecondaryItem> = [
  {
    title: 'Users',
    url: '#',
    icon: IconUsers,
    permission: { user: ['list'] },
  },
  {
    title: 'Get Help',
    url: '#',
    icon: IconHelp,
  },
  {
    title: 'Search',
    url: '#',
    icon: IconSearch,
  },
]

// const navDocumentsData: Array<NavDocumentItem> = [
//   {
//     name: 'Data Library',
//     url: '#',
//     icon: IconDatabase,
//   },
//   {
//     name: 'Reports',
//     url: '#',
//     icon: IconClipboardList,
//   },
//   {
//     name: 'Word Assistant',
//     url: '#',
//     icon: IconFile,
//   },
// ]

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
        {/* <NavDocuments items={navDocumentsData} /> */}
        <NavSecondary items={navSecondaryData} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
