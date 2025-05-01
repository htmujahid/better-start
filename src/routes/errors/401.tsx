import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/errors/401')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/errors/401"!</div>
}
