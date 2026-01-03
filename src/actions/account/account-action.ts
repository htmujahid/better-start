import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'
import { z } from 'zod'

const FOLDER_PREFIX = 'account-images'

export const uploadAccountImage = createServerFn({ method: 'POST' })
  .inputValidator(z.instanceof(FormData))
  .handler(async ({ data }) => {
    const file = data.get('file') as File
    const key = data.get('key') as string

    if (!file || !key) {
      throw new Error('Missing file or key')
    }

    const fullKey = `${FOLDER_PREFIX}/${key}`

    try {
      await env.better_start_buckets.put(fullKey, file, {
        httpMetadata: {
          contentType: file.type,
        },
      })
      return getImageUrl(key)
    } catch (error) {
      console.error('Error uploading image to R2:', error)
      throw new Error('Failed to upload image to R2')
    }
  })

export function getImageUrl(key: string): string {
  return `${process.env.R2_PUBLIC_URL}/${FOLDER_PREFIX}/${key}`
}

export const deleteAccountImage = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      key: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const fullKey = `${FOLDER_PREFIX}/${data.key}`
    await env.better_start_buckets.delete(fullKey)
  })
