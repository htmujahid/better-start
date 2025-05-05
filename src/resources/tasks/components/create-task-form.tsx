'use client'

import { Loader } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'

import { tasksApi } from '../tasks-api'
import { createTaskSchema } from '../lib/validations'

import type { CreateTaskSchema } from '../lib/validations'

import { tasks } from '@/db/schema'
import { Button } from '@/components/ui/button'
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

export function CreateTaskForm() {
  const router = useRouter()

  const form = useAppForm({
    defaultValues: {
      title: '',
      label: '',
      status: '',
      priority: '',
      estimatedHours: 0,
    } as unknown as CreateTaskSchema,
    validators: {
      onChange: createTaskSchema,
    },
    onSubmit: async ({ value }) => {
      const data = createTaskSchema.parse(value)

      const { error } = await tasksApi.create({
        data,
      })

      if (error) {
        toast.error(error)
        return
      }

      router.invalidate()
      toast.success('Task created')
      form.reset()
    },
  })

  return (
    <form.AppForm>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.AppField
              name="title"
              children={(field) => (
                <field.FormItem className="sm:col-span-2">
                  <field.FormLabel>Title</field.FormLabel>
                  <field.FormControl>
                    <Textarea
                      placeholder="Do a kickflip"
                      className="resize-none"
                      autoFocus
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
                      <SelectTrigger className="capitalize w-full">
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
                      <SelectTrigger className="capitalize w-full">
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
                      <SelectTrigger className="capitalize w-full">
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
          </div>
          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <Button disabled={isSubmitting}>
                {isSubmitting && <Loader className="animate-spin" />}
                Create
              </Button>
            )}
          />
        </div>
      </form>
    </form.AppForm>
  )
}
