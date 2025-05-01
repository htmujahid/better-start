import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/errors/404')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/errors/404"!</div>
}
