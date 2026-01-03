'use client'

import * as React from 'react'
import {
  Box,
  Command,
  LayoutDashboard,
  LifeBuoy,
  Package,
  Send,
  Settings2,
  ShoppingCart,
  Tags,
  Users,
} from 'lucide-react'

import { Link } from '@tanstack/react-router'
import { NavMain } from './nav-main'
import { NavProjects } from './nav-projects'
import { NavSecondary } from './nav-secondary'
import { NavUser } from './nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const data = {
  user: {
    name: 'Admin',
    email: 'admin@example.com',
    avatar: '/avatars/admin.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Products',
      url: '#',
      icon: Package,
      items: [
        {
          title: 'All Products',
          url: '/admin/products',
        },
        {
          title: 'Add Product',
          url: '/admin/products/new',
        },
        {
          title: 'Categories',
          url: '/admin/products/categories',
        },
        {
          title: 'Inventory',
          url: '/admin/products/inventory',
        },
      ],
    },
    {
      title: 'Orders',
      url: '#',
      icon: ShoppingCart,
      items: [
        {
          title: 'All Orders',
          url: '/admin/orders',
        },
        {
          title: 'Pending',
          url: '/admin/orders/pending',
        },
        {
          title: 'Completed',
          url: '/admin/orders/completed',
        },
        {
          title: 'Refunds',
          url: '/admin/orders/refunds',
        },
      ],
    },
    {
      title: 'Users',
      url: '#',
      icon: Users,
      items: [
        {
          title: 'All Users',
          url: '/admin/users',
        },
        {
          title: 'Roles',
          url: '/admin/users/roles',
        },
        {
          title: 'Permissions',
          url: '/admin/users/permissions',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '/admin/settings',
        },
        {
          title: 'Store',
          url: '/admin/settings/store',
        },
        {
          title: 'Payments',
          url: '/admin/settings/payments',
        },
        {
          title: 'Shipping',
          url: '/admin/settings/shipping',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
  projects: [
    {
      name: 'Products',
      url: '/admin/products',
      icon: Box,
    },
    {
      name: 'Orders',
      url: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      name: 'Promotions',
      url: '/admin/promotions',
      icon: Tags,
    },
  ],
}

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/admin">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">UseStore</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
