import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
} from '@tanstack/react-router'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import pathsConfig from '@/config/paths.config'

export const Route = createFileRoute('/home/account')({
  component: RouteComponent,
})

function RouteComponent() {
  const location = useLocation()

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <Tabs value={location.pathname}>
        <TabsList className="cursor-pointer">
          <Link to={pathsConfig.app.account}>
            <TabsTrigger value={pathsConfig.app.account}>Account</TabsTrigger>
          </Link>
          <Link to={pathsConfig.app.roles}>
            <TabsTrigger value={pathsConfig.app.roles}>Roles</TabsTrigger>
          </Link>
          <Link to={pathsConfig.app.sessions}>
            <TabsTrigger value={pathsConfig.app.sessions}>Sessions</TabsTrigger>
          </Link>
          <Link to={pathsConfig.app.danger}>
            <TabsTrigger value={pathsConfig.app.danger}>Danger</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  )
}
