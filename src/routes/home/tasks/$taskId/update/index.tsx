import {
  Link,
  createFileRoute,
  notFound,
  useRouter,
} from '@tanstack/react-router'
import { tasksApi } from '@/resources/tasks/tasks-api'
import { Page, PageTitleBar } from '@/components/page'
import { UpdateTaskForm } from '@/resources/tasks/components/update-task-form'
import { Button } from '@/components/ui/button'
import { DeleteTasksDialog } from '@/resources/tasks/components/delete-tasks-dialog'
import { hasPermissionPage } from '@/lib/auth-client-middleware'

export const Route = createFileRoute('/home/tasks/$taskId/update/')({
  beforeLoad: ({ context }) => {
    hasPermissionPage(context.user?.role, { task: ['update'] })
  },
  loader: async ({ params }) => {
    const result = await tasksApi.getById({
      data: {
        id: params.taskId,
      },
    })

    if (result.error || !result.data) {
      throw notFound()
    }

    return result.data
  },
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const data = Route.useLoaderData()

  return (
    <Page>
      <PageTitleBar title={data.code} description={'Task Details'}>
        <Link to="/home/tasks">
          <Button variant="outline">Back</Button>
        </Link>
        <DeleteTasksDialog
          tasks={[data]}
          onSuccess={() => router.navigate({ to: '/home/tasks' })}
        >
          <Button variant="destructive">Delete</Button>
        </DeleteTasksDialog>
      </PageTitleBar>
      <UpdateTaskForm data={data} />
    </Page>
  )
}
