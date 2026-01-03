'use client'

import { useEffect, useState } from 'react'

import { useForm } from '@tanstack/react-form'
import { Image as ImageIcon } from 'lucide-react'

import { ImageUploadInput } from './image-upload-input'
import { Button } from '@/components/ui/button'

export function ImageUploader(
  props: React.PropsWithChildren<{
    value: string | null | undefined
    onValueChange: (value: File | null) => unknown
  }>,
) {
  const [image, setImage] = useState(props.value)

  const form = useForm({
    defaultValues: {
      value: props.value as string | null | FileList,
    },
  })

  const onClear = () => {
    props.onValueChange(null)
    form.setFieldValue('value', null)
    setImage('')
  }

  const onValueChange = ({ image, file }: { image: string; file: File }) => {
    props.onValueChange(file)
    setImage(image)
  }

  useEffect(() => {
    setImage(props.value)
  }, [props.value])

  const Input = () => (
    <form.Field name="value">
      {(field) => (
        <ImageUploadInput
          name={field.name}
          accept={'image/*'}
          className={'absolute h-full w-full'}
          visible={false}
          multiple={false}
          onValueChange={onValueChange}
        />
      )}
    </form.Field>
  )

  if (!image) {
    return (
      <FallbackImage descriptionSection={props.children}>
        <Input />
      </FallbackImage>
    )
  }

  return (
    <div className={'flex items-center space-x-4'}>
      <label className={'animate-in fade-in zoom-in-50 relative h-20 w-20'}>
        <img
          decoding="async"
          className={'h-20 w-20 rounded-full object-cover'}
          src={image}
          alt={''}
        />

        <Input />
      </label>

      <div>
        <Button onClick={onClear} size={'sm'} variant={'ghost'}>
          Clear
        </Button>
      </div>
    </div>
  )
}

function FallbackImage(
  props: React.PropsWithChildren<{
    descriptionSection?: React.ReactNode
  }>,
) {
  return (
    <div className={'flex items-center space-x-4'}>
      <label
        className={
          'border-border animate-in fade-in zoom-in-50 hover:border-primary relative flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-full border'
        }
      >
        <ImageIcon className={'text-primary h-8'} />

        {props.children}
      </label>

      {props.descriptionSection}
    </div>
  )
}
