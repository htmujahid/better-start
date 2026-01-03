import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/_sidebar/a')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/home/_sidebar/a"!</div>
}
