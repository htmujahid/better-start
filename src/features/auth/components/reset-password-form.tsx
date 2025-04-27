import { useState } from 'react'
import { z } from 'zod'
import { Link, useSearch } from '@tanstack/react-router'

import { AuthError } from './auth-error'
import { AuthSuccess } from './auth-success'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { If } from '@/components/if'
import { useAppForm } from '@/core/form-builder/form'

const resetPasswordFormSchema = z
  .object({
    password: z.string().min(8),
    confirm_password: z.string().min(8),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

export function ResetPasswordForm() {
  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)

  const { token } = useSearch({
    from: '/auth/reset-password/',
  })

  const form = useAppForm({
    defaultValues: {
      password: '',
      confirm_password: '',
      token,
    },
    validators: {
      onChange: resetPasswordFormSchema,
    },
    onSubmit: async ({ value }) => {
      const { password, token } = value

      await authClient.resetPassword(
        {
          newPassword: password,
          token,
        },
        {
          onError: ({ error: err }) => {
            setError(err.message)
            setSuccess(undefined)
          },
          onSuccess: () => {
            setError(undefined)
            setSuccess('Password reset successfully')
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
          <If condition={success}>
            {(data) => <AuthSuccess message={data} />}
          </If>
          <div className="grid gap-3">
            <form.AppField
              name="password"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel htmlFor="password">Password</field.FormLabel>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <field.FormMessage />
                </field.FormItem>
              )}
            />
            <form.AppField
              name="confirm_password"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel htmlFor="confirm_password">
                    Confirm Password
                  </field.FormLabel>
                  <Input
                    id="confirm_password"
                    type="password"
                    name="confirm_password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <field.FormMessage />
                </field.FormItem>
              )}
            />
            <form.Subscribe
              selector={(state) => state.isSubmitting}
              children={(isSubmitting) => (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  Reset Password
                </Button>
              )}
            />
          </div>
          <div className="text-center text-sm">
            Want to go back?{' '}
            <Link to="/auth/sign-in" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </form.AppForm>
  )
}
