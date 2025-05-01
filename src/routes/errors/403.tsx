import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/errors/403')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/errors/403"!</div>
}
