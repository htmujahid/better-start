import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server'
import * as z from 'zod'
import type { Task } from '@/db/schema'
import { tasks } from '@/db/schema'

import { getFiltersStateParser, getSortingStateParser } from '@/lib/parsers'

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Task>().withDefault([
    { id: 'createdAt', desc: true },
  ]),
  title: parseAsString.withDefault(''),
  status: parseAsArrayOf(z.enum(tasks.status.enumValues)),
  priority: parseAsArrayOf(z.enum(tasks.priority.enumValues)),
  estimatedHours: parseAsArrayOf(z.coerce.number()),
  createdAt: parseAsArrayOf(z.coerce.number()),
  // advanced filter
  filters: getFiltersStateParser(),
  joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and'),
})

export const createTaskSchema = z.object({
  title: z.string().min(1),
  label: z.enum(tasks.label.enumValues),
  status: z.enum(tasks.status.enumValues),
  priority: z.enum(tasks.priority.enumValues),
  estimatedHours: z.coerce.number().optional(),
})

export const updateTaskSchema = z.object({
  title: z.string().min(0),
  label: z.enum(tasks.label.enumValues).optional(),
  status: z.enum(tasks.status.enumValues).optional(),
  priority: z.enum(tasks.priority.enumValues).optional(),
  estimatedHours: z.coerce.number().optional(),
})

export const updateManyTaskSchema = z.object({
  ids: z.array(z.string()),
  label: z.enum(tasks.label.enumValues).optional(),
  status: z.enum(tasks.status.enumValues).optional(),
  priority: z.enum(tasks.priority.enumValues).optional(),
})

export type GetTasksSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>
export type CreateTaskSchema = z.infer<typeof createTaskSchema>
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>