import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import pathsConfig from '@/config/paths.config'

export const Route = createFileRoute('/home')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: pathsConfig.auth.signIn,
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
