import { createFileRoute } from '@tanstack/react-router'

import { Page, PageTitleBar } from '@/components/page'
import { CreateTaskForm } from '@/resources/tasks/components/create-task-form'
import { hasPermissionPage } from '@/lib/auth-client-middleware'

export const Route = createFileRoute('/home/tasks/create/')({
  beforeLoad: ({ context }) => {
    hasPermissionPage(context?.user?.role, { task: ['create'] })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Page>
      <PageTitleBar title="Create Task" description="Create a new task" />
      <CreateTaskForm />
    </Page>
  )
}
