import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const s3Client = new S3Client({
  region: process.env.S3_REGION!,
  forcePathStyle: true,
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
})

export const uploadImageToS3 = createServerFn({ method: 'POST' })
  .validator(
    z.instanceof(FormData),
  )
  .handler(async ({ data }) => {
    const file = data.get('file') as File
    const key = data.get('key') as string
    const bucketName = data.get('bucketName') as string

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    )

    return getImageUrl(key, bucketName)
  })

export function getImageUrl(key: string, bucketName: string): string {
  return `${process.env.S3_PUBLIC_PATH}/${bucketName}/${key}`
}

export const deleteImageFromS3 = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      key: z.string(),
      bucketName: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: data.bucketName,
        Key: data.key,
      }),
    )
  })
