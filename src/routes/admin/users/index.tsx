import { createFileRoute } from '@tanstack/react-router'
import {
  listUsersAction,
  searchSchema,
} from '@/actions/admin/list-users-action'
import { UsersList } from '@/components/admin/users-list'

export const Route = createFileRoute('/admin/users/')({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const data = await context?.queryClient.fetchQuery({
      queryKey: ['users'],
      queryFn: ({ signal }) => listUsersAction({ signal, data: deps }),
    })

    return data
  },
  component: RouteComponent,
})

function RouteComponent() {
  const data = Route.useLoaderData()
  const search = Route.useSearch()

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <UsersList
        data={data.users}
        pageCount={Math.ceil(data.total / search.perPage)}
        search={search}
      />
    </div>
  )
}
