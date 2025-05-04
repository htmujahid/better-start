'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { useUser } from '../hooks/use-user'
import { ImageUploader } from '@/components/image-uploader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { deleteImageFromS3, uploadImageToS3 } from '@/lib/aws-s3.client'

const AVATARS_BUCKET = 'account-image'

export function UpdateAccountImage() {
  const { user } = useUser()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>Update your profile picture below.</CardDescription>
      </CardHeader>
      <CardContent>
        <UploadProfileAvatarForm
          imageUrl={user?.image ?? null}
          userId={user?.id ?? ''}
          onAvatarUpdated={() => console.log('avatar updated')}
        />
      </CardContent>
    </Card>
  )
}

function UploadProfileAvatarForm(props: {
  imageUrl: string | null
  userId: string
  onAvatarUpdated: () => void
}) {
  const createToaster = useCallback((promise: () => Promise<unknown>) => {
    return toast.promise(promise, {
      success: 'Profile picture updated',
      error: 'Failed to update profile picture',
      loading: 'Updating profile picture',
    })
  }, [])

  const onValueChange = useCallback(
    (file: File | null) => {
      const removeExistingStorageFile = async () => {
        if (props.imageUrl) {
          const key = props.imageUrl.split('/').pop()?.split('?')[0]
          if (key) {
            await deleteImageFromS3({
              data: {
                key,
                bucketName: AVATARS_BUCKET,
              },
            })
          }
        }
      }

      if (file) {
        const promise = async () => {
          await removeExistingStorageFile()
          const extension = file.name.split('.').pop()
          const key = await getAvatarFileName(props.userId, extension)
          const imageUrl = await uploadImageToS3({
            data: {
              file,
              key,
              bucketName: AVATARS_BUCKET,
            },
          })
          // update image url in user
          console.log('imageUrl', imageUrl)
          props.onAvatarUpdated()
        }

        createToaster(promise)
      } else {
        const promise = async () => {
          await removeExistingStorageFile()
          // update image url in user
          console.log('imageUrl', null)
          props.onAvatarUpdated()
        }

        createToaster(promise)
      }
    },
    [createToaster, props],
  )

  return (
    <ImageUploader value={props.imageUrl} onValueChange={onValueChange}>
      <div className={'flex flex-col space-y-1'}>
        <span className={'text-sm'}>Profile Picture</span>
        <span className={'text-xs'}>Profile Picture</span>
      </div>
    </ImageUploader>
  )
}

async function getAvatarFileName(
  userId: string,
  extension: string | undefined,
) {
  const { nanoid } = await import('nanoid')
  const uniqueId = nanoid(16)
  return `${userId}.${extension}?v=${uniqueId}`
}
