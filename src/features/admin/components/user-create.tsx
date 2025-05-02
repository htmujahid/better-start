import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useRouter } from '@tanstack/react-router'

import type { Role } from '@/lib/roles'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppForm } from '@/core/form-builder/form'
import { rolesData } from '@/lib/roles'
import { authClient } from '@/lib/auth-client'

const userCreateFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(rolesData as [string, ...Array<string>]),
})

export function UserCreateDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
      role: 'user',
    },
    validators: {
      onChange: userCreateFormSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.admin.createUser({
        email: value.email,
        password: value.password,
        name: value.name,
        role: value.role as Role,
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('User created successfully')
        router.invalidate()
      }

      setOpen(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={'sm'}>Create User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <form.AppForm>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="grid gap-6"
          >
            <div className="grid gap-3">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Name</field.FormLabel>
                    <field.FormControl>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
              <form.AppField
                name="email"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Email</field.FormLabel>
                    <field.FormControl>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
              <form.AppField
                name="password"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Password</field.FormLabel>
                    <field.FormControl>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="********"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
              <form.AppField
                name="role"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Role</field.FormLabel>
                    <field.FormControl>
                      <Select
                        value={field.state.value}
                        onValueChange={(value: Role) =>
                          field.handleChange(value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
              <form.Subscribe
                selector={(state) => state.isSubmitting}
                children={(isSubmitting) => (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    Create User
                  </Button>
                )}
              />
            </div>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  )
}
