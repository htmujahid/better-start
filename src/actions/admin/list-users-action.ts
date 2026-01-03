import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import z from 'zod'
import type { UserWithRole } from 'better-auth/plugins'
import { auth } from '@/lib/auth'

export const searchSchema = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).default(10),
  name: z.string().optional(),
  role: z.string().optional(),
  sort: z.array(z.object({ id: z.string(), desc: z.boolean() })).optional(),
})

export const listUsersAction = createServerFn()
  .inputValidator(searchSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()

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

    return response as {
      total: number
      users: Array<UserWithRole>
    }
  })
