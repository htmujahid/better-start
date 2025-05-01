import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/errors/500')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/errors/500"!</div>
}
