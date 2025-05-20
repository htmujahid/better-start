import { useState } from 'react'
import { z } from 'zod'
import { useNavigate, useSearch } from '@tanstack/react-router'

import { AuthError } from './auth-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { If } from '@/components/if'
import { useAppForm } from '@/core/form-builder/form'

const passwordResetSchema = z.object({
  email: z.string().email(),
})

export function PasswordResetForm() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | undefined>(undefined)
  const { token } = useSearch({ from: '/auth/reset-password/' })

  const form = useAppForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: passwordResetSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.resetPassword(
        {
          newPassword: value.email,
          token,
        },
        {
          onError: (err) => {
            setError(err.error.message)
          },
          onSuccess: () => {
            navigate({
              to: '/auth/reset-password',
              search: { token },
              replace: true,
            })
          },
        },
      )
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
        <div className="grid gap-3">
          <If condition={error}>{(data) => <AuthError error={data} />}</If>
          <form.AppField
            name="email"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Email</field.FormLabel>
                <field.FormControl>
                  <Input
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
          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <Button className="w-full" disabled={isSubmitting}>
                Reset Password
              </Button>
            )}
          />
        </div>
      </form>
    </form.AppForm>
  )
} 