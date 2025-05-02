import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { hasPermissionPage } from '@/lib/auth-client-middleware'
import { tasksApi } from '@/resources/tasks/tasks-api'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { TasksTable } from '@/resources/tasks/components/tasks-table'

export const Route = createFileRoute('/home/tasks/')({
  beforeLoad: ({ context }) => {
    hasPermissionPage(context.user?.role, { task: ['read'] })
  },
  validateSearch: (search) => search,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    return Promise.all([
      tasksApi.getAll({
        data: deps,
      }),
      tasksApi.getStatusCounts(),
      tasksApi.getPriorityCounts(),
      tasksApi.getEstimatedHoursRange(),
    ])
  },
  component: RouteComponent,
})

function RouteComponent() {
  const promises = Route.useLoaderData()

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={7}
            filterCount={2}
            cellWidths={[
              '10rem',
              '30rem',
              '10rem',
              '10rem',
              '6rem',
              '6rem',
              '6rem',
            ]}
            shrinkZero
          />
        }
      >
        <TasksTable promises={promises} />
      </React.Suspense>
    </div>
  )
}
