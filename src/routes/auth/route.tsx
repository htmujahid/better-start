import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AppLogo } from '@/components/app-logo'
import pathsConfig from '@/config/paths.config'

export const Route = createFileRoute('/auth')({
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({
        to: pathsConfig.app.home,
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <AppLogo />
        <Outlet />
      </div>
    </div>
  )
}
