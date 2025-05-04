'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { useUser } from '../hooks/use-user'
import { deleteAccountImage, uploadAccountImage } from '../lib/actions'

import { ImageUploader } from '@/components/image-uploader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { authClient } from '@/lib/auth-client'

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
          const key = props.imageUrl.split('/').pop()

          if (key) {
            await deleteAccountImage({
              data: {
                key,
              },
            })
          }
        }
      }

      if (file) {
        const promise = async () => {
          await removeExistingStorageFile()
          const extension = file.name.split('.').pop()
          const key = getAvatarFileName(props.userId, extension)
          console.log('key', key)
          const formData = new FormData()
          formData.append('file', file)
          formData.append('key', key)

          const imageUrl = await uploadAccountImage({
            data: formData,
          })

          await authClient.updateUser({
            image: imageUrl,
          })
          props.onAvatarUpdated()
        }

        createToaster(promise)
      } else {
        const promise = async () => {
          await removeExistingStorageFile()
          await authClient.updateUser({
            image: null,
          })
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

function getAvatarFileName(userId: string, extension: string | undefined) {
  return `${userId}.${extension}`
}
