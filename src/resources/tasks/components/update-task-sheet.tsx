'use client'

import { Loader } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'

import { tasksApi } from '../tasks-api'
import { updateTaskSchema } from '../lib/validations'
import type { UpdateTaskSchema } from '../lib/validations'

import { tasks } from '@/db/schema'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAppForm } from '@/core/form-builder/form'

interface UpdateTaskSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  data: UpdateTaskSchema & { id: string }
}

export function UpdateTaskSheet({ data, ...props }: UpdateTaskSheetProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const form = useAppForm({
    defaultValues: {
      title: data?.title,
      label: data?.label,
      status: data?.status,
      priority: data?.priority,
      estimatedHours: data?.estimatedHours,
    },
    validators: {
      onChange: (value) => {
        try {
          updateTaskSchema.parse(value)
          return true
        } catch (error) {
          return false
        }
      },
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        const { error } = await tasksApi.update({
          data: {
            ...value,
            id: data.id,
          },
        })

        if (error) {
          toast.error(error)
          return
        }

        props.onOpenChange?.(false)
        toast.success('Task updated')
        router.invalidate()
      })
    },
  })

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Update task</SheetTitle>
          <SheetDescription>
            Update the task details and save the changes
          </SheetDescription>
        </SheetHeader>
        <form.AppForm>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <div className="flex flex-col gap-4 px-4">
              <form.AppField
                name="title"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Title</field.FormLabel>
                    <field.FormControl>
                      <Textarea
                        placeholder="Do a kickflip"
                        className="resize-none"
                        value={field.state.value ?? ''}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
              <form.AppField
                name="label"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Label</field.FormLabel>
                    <field.FormControl>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => {
                          field.handleChange(
                            value as (typeof tasks.label.enumValues)[number],
                          )
                          field.handleBlur()
                        }}
                      >
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder="Select a label" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {tasks.label.enumValues.map((item) => (
                              <SelectItem
                                key={item}
                                value={item}
                                className="capitalize"
                              >
                                {item}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
              <form.AppField
                name="status"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Status</field.FormLabel>
                    <field.FormControl>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => {
                          field.handleChange(
                            value as (typeof tasks.status.enumValues)[number],
                          )
                          field.handleBlur()
                        }}
                      >
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {tasks.status.enumValues.map((item) => (
                              <SelectItem
                                key={item}
                                value={item}
                                className="capitalize"
                              >
                                {item}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
              <form.AppField
                name="priority"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Priority</field.FormLabel>
                    <field.FormControl>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => {
                          field.handleChange(
                            value as (typeof tasks.priority.enumValues)[number],
                          )
                          field.handleBlur()
                        }}
                      >
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder="Select a priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {tasks.priority.enumValues.map((item) => (
                              <SelectItem
                                key={item}
                                value={item}
                                className="capitalize"
                              >
                                {item}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
              <form.AppField
                name="estimatedHours"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Estimated Hours</field.FormLabel>
                    <field.FormControl>
                      <Input
                        type="number"
                        placeholder="Enter estimated hours"
                        step="0.5"
                        min="0"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(e.target.valueAsNumber)
                        }
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
              <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </SheetClose>
                <Button disabled={isPending}>
                  {isPending && <Loader className="animate-spin" />}
                  Save
                </Button>
              </SheetFooter>
            </div>
          </form>
        </form.AppForm>
      </SheetContent>
    </Sheet>
  )
}
