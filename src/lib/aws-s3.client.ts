import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export const uploadImageToS3 = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      file: z.instanceof(File),
      key: z.string(),
      bucketName: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const arrayBuffer = await data.file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await s3Client.send(
      new PutObjectCommand({
        Bucket: data.bucketName,
        Key: data.key,
        Body: buffer,
        ContentType: data.file.type,
      }),
    )

    return getImageUrl(data.key, data.bucketName)
  })

export function getImageUrl(key: string, bucketName: string): string {
  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
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
