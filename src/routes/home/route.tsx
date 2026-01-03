import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import pathsConfig from '@/config/paths.config'

export const Route = createFileRoute('/home')({
  beforeLoad: ({ context }) => {
    if (!context?.user) {
      throw redirect({
        to: pathsConfig.auth.signIn,
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  )
}
