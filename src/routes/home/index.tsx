import { createFileRoute } from '@tanstack/react-router'

import { SectionCards } from '@/components/section-cards'

export const Route = createFileRoute('/home/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <SectionCards />
    </div>
  )
}
