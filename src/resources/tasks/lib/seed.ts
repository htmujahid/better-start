import { generateRandomTask } from './utils'

import type { Task } from '@/db/schema'

import { db } from '@/db/index'

import { tasks } from '@/db/schema'

export async function seedTasks(input: { count: number }) {
  const count = input.count ?? 100

  try {
    const allTasks: Array<Task> = []

    for (let i = 0; i < count; i++) {
      allTasks.push(generateRandomTask())
    }

    await db.delete(tasks)

    console.log('📝 Inserting tasks', allTasks.length)

    await db.insert(tasks).values(allTasks).onConflictDoNothing()
  } catch (err) {
    console.error(err)
  }
}

seedTasks({ count: 100 })
