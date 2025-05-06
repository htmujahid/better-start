import {
  Link,
  createFileRoute,
  notFound,
  useRouter,
} from '@tanstack/react-router'
import { CalendarIcon, ClockIcon, PencilIcon } from 'lucide-react'

import { tasksApi } from '@/resources/tasks/tasks-api'
import { Page, PageTitleBar } from '@/components/page'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DeleteTasksDialog } from '@/resources/tasks/components/delete-tasks-dialog'
import { hasPermissionPage } from '@/lib/auth-client-middleware'

export const Route = createFileRoute('/home/tasks/$taskId/show/')({
  beforeLoad: ({ context }) => {
    hasPermissionPage(context?.user?.role, { task: ['read'] })
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
        <Link
          to="/home/tasks/$taskId/update"
          params={{ taskId: data.id }}
          className="flex items-center gap-2"
        >
          <Button>
            <PencilIcon className="size-4" />
            Edit
          </Button>
        </Link>
        <DeleteTasksDialog
          tasks={[data]}
          onSuccess={() => router.navigate({ to: '/home/tasks' })}
        >
          <Button variant="destructive">Delete</Button>
        </DeleteTasksDialog>
      </PageTitleBar>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Badge variant="outline">{data.label}</Badge>
              <Badge variant="secondary">{data.status}</Badge>
              <Badge
                variant={data.priority === 'high' ? 'destructive' : 'default'}
              >
                {data.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p
              className={cn(
                'text-sm text-muted-foreground',
                data.archived && 'line-through',
              )}
            >
              {data.title}
            </p>
            <Separator />
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <ClockIcon className="size-4" />
                <span>{data.estimatedHours}h</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-4" />
                <span>{data.createdAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Page>
  )
}
