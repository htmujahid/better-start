import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'

import type { User } from '@/db/schema'
import { auth } from '@/lib/auth'
import { UsersList } from '@/features/admin/components/users-list'

const searchSchema = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).default(10),
  name: z.string().optional(),
  role: z.string().optional(),
  sort: z.array(z.object({ id: z.string(), desc: z.boolean() })).optional(),
})

export const fetchUsers = createServerFn()
  .validator(searchSchema)
  .handler(async ({ data }) => {
    const { headers } = getWebRequest()!

    const sortLength = data.sort?.length ?? 0
    const currentSort = data.sort?.[sortLength - 1] ?? {
      id: 'createdAt',
      desc: true,
    }

    const response = await auth.api.listUsers({
      query: {
        limit: data.perPage,
        offset: (data.page - 1) * data.perPage,
        sortBy: currentSort.id,
        sortDirection: currentSort.desc ? 'desc' : 'asc',
        searchField: 'name',
        searchOperator: 'contains',
        searchValue: data.name,
        filterField: 'role',
        filterOperator: 'eq',
        filterValue: data.role,
      },
      headers,
    })

    return response
  })

export const Route = createFileRoute('/admin/users/')({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const data = await context?.queryClient.fetchQuery({
      queryKey: ['users'],
      queryFn: ({ signal }) => fetchUsers({ signal, data: deps }),
    })

    return data
  },
  component: RouteComponent,
})

function RouteComponent() {
  const data = Route.useLoaderData()
  const { perPage } = Route.useSearch()

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <UsersList
        data={data.users as Array<User>}
        pageCount={Math.ceil(data.total / perPage)}
      />
    </div>
  )
}
