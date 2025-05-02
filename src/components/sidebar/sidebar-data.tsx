import {
  IconClipboardList,
  IconDashboard,
  IconDatabase,
  IconFile,
  IconHelp,
  IconListDetails,
  IconPackage,
  IconTable,
  IconUsers,
} from '@tabler/icons-react'
import type { NavTopItem } from './nav-top'
import type { NavResourceItem } from './nav-resources'
import type { NavSecondaryItem } from './nav-secondary'
import type { NavDocumentItem } from './nav-documents'

export const navTopData: Array<NavTopItem> = [
  {
    title: 'Dashboard',
    url: '/home',
    icon: IconDashboard,
  },
  {
    title: 'Tasks',
    url: '/home/tasks',
    icon: IconListDetails,
    permission: { task: ['read'] },
  },
]

// export const navMainData: Array<NavMainItem> = [
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

export const navResourceShopData: Array<NavResourceItem> = [
  {
    title: 'Products',
    url: '#',
    icon: IconTable,
    disabled: true,
  },
  {
    title: 'Orders',
    url: '#',
    icon: IconPackage,
    disabled: true,
  },
  {
    title: 'Customers',
    url: '#',
    icon: IconUsers,
    disabled: true,
  },
]

export const navSecondaryData: Array<NavSecondaryItem> = [
  {
    title: 'Users',
    url: '/admin/users',
    icon: IconUsers,
    permission: { user: ['list'] },
  },
  {
    title: 'Get Help',
    url: 'https://github.com/htmujahid/better-admin',
    target: '_blank',
    icon: IconHelp,
  },
]

export const navDocumentsData: Array<NavDocumentItem> = [
  {
    name: 'Data Library',
    url: '#',
    icon: IconDatabase,
    disabled: true,
  },
  {
    name: 'Reports',
    url: '#',
    icon: IconClipboardList,
    disabled: true,
  },
  {
    name: 'Assets',
    url: '#',
    icon: IconFile,
    disabled: true,
  },
]

export const searchCommandData: Record<string, Array<NavTopItem>> = {
  Suggestions: navTopData,
  Shop: navResourceShopData,
}
