import { Outlet, createFileRoute } from '@tanstack/react-router'

import { AccountNav } from '@/components/account/account-nav'
import { SiteHeader } from '@/components/layout/site-header'

export const Route = createFileRoute('/home/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <SiteHeader />
      <div className="container mx-auto flex px-4">
        <aside className="w-48 shrink-0 py-4">
          <AccountNav />
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
