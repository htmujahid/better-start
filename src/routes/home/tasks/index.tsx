import React from 'react'
import { PlusIcon } from 'lucide-react'
import { Link, createFileRoute } from '@tanstack/react-router'

import { hasPermissionPage } from '@/lib/auth-client-middleware'
import { tasksApi } from '@/resources/tasks/tasks-api'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { TasksTable } from '@/resources/tasks/components/tasks-table'
import { Page, PageTitleBar } from '@/components/page'
import { Button } from '@/components/ui/button'

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
    <Page>
      <PageTitleBar title="Tasks" description="Manage your tasks">
        <Link to="/home/tasks/create">
          <Button>
            <PlusIcon />
            New Task
          </Button>
        </Link>
      </PageTitleBar>

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
    </Page>
  )
}
