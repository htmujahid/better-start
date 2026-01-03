import { createFileRoute } from '@tanstack/react-router'
import { SiteHeader } from '@/components/layout/site-header'

export const Route = createFileRoute('/home/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <SiteHeader />
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
        <p className="mt-4 text-lg">
          This is the home page of our application. Explore our features and
          enjoy your stay!
        </p>
      </main>
    </div>
  )
}
