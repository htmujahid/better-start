import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  lte,
  not,
  sql,
} from 'drizzle-orm'
import { customAlphabet } from 'nanoid'
import { z } from 'zod'

import { createServerFn } from '@tanstack/react-start'

import { generateRandomTask } from './lib/utils'
import {
  createTaskSchema,
  searchParamsCache,
  updateManyTaskSchema,
  updateTaskSchema,
} from './lib/validations'

import { tasks } from '@/db/schema'
import { takeFirstOrThrow } from '@/db/utils'
import { db } from '@/db'
import { getErrorMessage } from '@/lib/handle-error'
import { authMiddleware } from '@/lib/auth-middleware'

const getTaskById = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string() }))
  .middleware([authMiddleware({ permissions: { task: ['read'] } })])
  .handler(async ({ data }) => {
    try {
      const { id } = await z.object({ id: z.string() }).parse(data)
      const task = await db.select().from(tasks).where(eq(tasks.id, id))
      return task
    } catch (err) {
      return { data: null, error: getErrorMessage(err) }
    }
  })

const getTasks = createServerFn({ method: 'GET' })
  .validator(search => searchParamsCache.parse(search as any))
  .middleware([authMiddleware({ permissions: { task: ['read'] } })])
  .handler(async ({ data }) => {
    const input = data

    try {
      const offset = (input.page - 1) * input.perPage

      const status = input.status ?? []

      const priority = input.priority ?? []
      const estimatedHours = input.estimatedHours ?? []
      const createdAt = input.createdAt ?? []

      const where = and(
        input.title ? ilike(tasks.title, `%${input.title}%`) : undefined,
        status.length > 0 ? inArray(tasks.status, status) : undefined,
        priority.length > 0 ? inArray(tasks.priority, priority) : undefined,
        estimatedHours.length > 0
          ? and(
              estimatedHours[0]
                ? gte(tasks.estimatedHours, estimatedHours[0])
                : undefined,
              estimatedHours[1]
                ? lte(tasks.estimatedHours, estimatedHours[1])
                : undefined,
            )
          : undefined,
        createdAt.length > 0
          ? and(
              createdAt[0]
                ? gte(
                    tasks.createdAt,
                    (() => {
                      const date = new Date(createdAt[0])
                      date.setHours(0, 0, 0, 0)
                      return date
                    })(),
                  )
                : undefined,
              createdAt[1]
                ? lte(
                    tasks.createdAt,
                    (() => {
                      const date = new Date(createdAt[1])
                      date.setHours(23, 59, 59, 999)
                      return date
                    })(),
                  )
                : undefined,
            )
          : undefined,
      )

      const orderBy =
        input.sort.length > 0
          ? input.sort.map((item) => {
              const column = tasks[item.id as keyof typeof tasks] as any
              return item.desc ? desc(column) : asc(column)
            })
          : [asc(tasks.createdAt)]

      const { data, total } = await db.transaction(async (tx) => {
        const data = await tx
          .select()
          .from(tasks)
          .limit(input.perPage)
          .offset(offset)
          .where(where)
          .orderBy(...orderBy)

        const total = await tx
          .select({
            count: count(),
          })
          .from(tasks)
          .where(where)
          .execute()
          .then((res) => res[0]?.count ?? 0)

        return {
          data,
          total,
        }
      })

      const pageCount = Math.ceil(total / input.perPage)
      return { data, pageCount }
    } catch (_err) {
      return { data: [], pageCount: 0 }
    }
  })

const getTaskStatusCounts = createServerFn()
  .middleware([authMiddleware({ permissions: { task: ['read'] } })])
  .handler(async () => {
    try {
      return await db
        .select({
          status: tasks.status,
          count: count(),
        })
        .from(tasks)
        .groupBy(tasks.status)
        .having(gt(count(tasks.status), 0))
        .then((res) =>
          res.reduce(
            (acc, { status, count }) => {
              acc[status] = count
              return acc
            },
            {
              todo: 0,
              'in-progress': 0,
              done: 0,
              canceled: 0,
            },
          ),
        )
    } catch (_err) {
      return {
        todo: 0,
        'in-progress': 0,
        done: 0,
        canceled: 0,
      }
    }
  })

const getTaskPriorityCounts = createServerFn()
  .middleware([authMiddleware({ permissions: { task: ['read'] } })])
  .handler(async () => {
    try {
      return await db
        .select({
          priority: tasks.priority,
          count: count(),
        })
        .from(tasks)
        .groupBy(tasks.priority)
        .having(gt(count(), 0))
        .then((res) =>
          res.reduce(
            (acc, { priority, count }) => {
              acc[priority] = count
              return acc
            },
            {
              low: 0,
              medium: 0,
              high: 0,
            },
          ),
        )
    } catch (_err) {
      return {
        low: 0,
        medium: 0,
        high: 0,
      }
    }
  })

const getTaskEstimatedHoursRange = createServerFn()
  .middleware([authMiddleware({ permissions: { task: ['read'] } })])
  .handler(async () => {
    try {
      return await db
        .select({
          min: sql<number>`min(${tasks.estimatedHours})`,
          max: sql<number>`max(${tasks.estimatedHours})`,
        })
        .from(tasks)
        .then((res) => res[0] ?? { min: 0, max: 0 })
    } catch (_err) {
      return { min: 0, max: 0 }
    }
  })

const createTask = createServerFn({ method: 'POST' })
  .validator(createTaskSchema)
  .middleware([authMiddleware({ permissions: { task: ['create'] } })])
  .handler(async ({ data }) => {
    try {
      console.log(data)
      await db.transaction(async (tx) => {
        const newTask = await tx
          .insert(tasks)
          .values({
            code: `TASK-${customAlphabet('0123456789', 4)()}`,
            title: data.title,
            status: data.status,
            label: data.label,
            priority: data.priority,
          })
          .returning({
            id: tasks.id,
          })
          .then(takeFirstOrThrow)

        // Delete a task to keep the total number of tasks constant
        await tx.delete(tasks).where(
          eq(
            tasks.id,
            (
              await tx
                .select({
                  id: tasks.id,
                })
                .from(tasks)
                .limit(1)
                .where(not(eq(tasks.id, newTask.id)))
                .orderBy(asc(tasks.createdAt))
                .then(takeFirstOrThrow)
            ).id,
          ),
        )
      })

      return {
        data: null,
        error: null,
      }
    } catch (err) {
      return {
        data: null,
        error: getErrorMessage(err),
      }
    }
  })

const updateTask = createServerFn({ method: 'POST' })
  .validator(updateTaskSchema.extend({ id: z.string() }))
  .middleware([authMiddleware({ permissions: { task: ['update'] } })])
  .handler(async ({ data }) => {
    try {
      const response = await db
        .update(tasks)
        .set({
          title: data.title,
          label: data.label,
          status: data.status,
          priority: data.priority,
        })
        .where(eq(tasks.id, data.id))
        .returning({
          status: tasks.status,
          priority: tasks.priority,
        })
        .then(takeFirstOrThrow)

      return {
        data: response,
        error: null,
      }
    } catch (err) {
      return {
        data: null,
        error: getErrorMessage(err),
      }
    }
  })

const updateTasks = createServerFn({ method: 'POST' })
  .validator(updateManyTaskSchema)
  .middleware([authMiddleware({ permissions: { task: ['update'] } })])
  .handler(async ({ data }) => {
    try {
      const response = await db
        .update(tasks)
        .set({
          label: data.label,
          status: data.status,
          priority: data.priority,
        })
        .where(inArray(tasks.id, data.ids))
        .returning({
          status: tasks.status,
          priority: tasks.priority,
        })
        .then(takeFirstOrThrow)

      return {
        data: response,
        error: null,
      }
    } catch (err) {
      return {
        data: null,
        error: getErrorMessage(err),
      }
    }
  })

const deleteTask = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string() }))
  .middleware([authMiddleware({ permissions: { task: ['delete'] } })])
  .handler(async ({ data }) => {
    try {
      await db.transaction(async (tx) => {
        await tx.delete(tasks).where(eq(tasks.id, data.id))

        await tx.insert(tasks).values(generateRandomTask())
      })

      return {
        data: null,
        error: null,
      }
    } catch (err) {
      return {
        data: null,
        error: getErrorMessage(err),
      }
    }
  })

const deleteTasks = createServerFn({ method: 'POST' })
  .validator(z.object({ ids: z.array(z.string()) }))
  .middleware([authMiddleware({ permissions: { task: ['delete'] } })])
  .handler(async ({ data }) => {
    try {
      await db.transaction(async (tx) => {
        await tx.delete(tasks).where(inArray(tasks.id, data.ids))

        // Create new tasks for the deleted ones
        await tx.insert(tasks).values(data.ids.map(() => generateRandomTask()))
      })

      return {
        data: null,
        error: null,
      }
    } catch (err) {
      return {
        data: null,
        error: getErrorMessage(err),
      }
    }
  })

export const tasksApi = {
  getById: getTaskById,
  getAll: getTasks,
  getStatusCounts: getTaskStatusCounts,
  getPriorityCounts: getTaskPriorityCounts,
  getEstimatedHoursRange: getTaskEstimatedHoursRange,
  create: createTask,
  update: updateTask,
  updateMany: updateTasks,
  delete: deleteTask,
  deleteMany: deleteTasks,
}
