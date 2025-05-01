import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
} from '@tanstack/react-router'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Route = createFileRoute('/home/account')({
  component: RouteComponent,
})

function RouteComponent() {
  const location = useLocation()

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <Tabs defaultValue={location.pathname}>
        <TabsList className="cursor-pointer">
          <Link to="/home/account">
            <TabsTrigger value="/home/account">Account</TabsTrigger>
          </Link>
          <Link to="/home/account/roles">
            <TabsTrigger value="/home/account/roles">Roles</TabsTrigger>
          </Link>
          <Link to="/home/account/sessions">
            <TabsTrigger value="/home/account/sessions">Sessions</TabsTrigger>
          </Link>
          <Link to="/home/account/danger">
            <TabsTrigger value="/home/account/danger">Danger</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  )
}
