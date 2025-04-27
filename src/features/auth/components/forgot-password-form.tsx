import { useState } from 'react'
import { z } from 'zod'
import { Link } from '@tanstack/react-router'

import { AuthError } from './auth-error'
import { AuthSuccess } from './auth-success'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { If } from '@/components/if'
import appConfig from '@/config/app.config'
import pathsConfig from '@/config/paths.config'
import { useAppForm } from '@/core/form-builder/form'

const forgotPasswordFormSchema = z.object({
  email: z.string().email(),
})

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)

  const form = useAppForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: forgotPasswordFormSchema,
    },
    onSubmit: async ({ value }) => {
      const { email } = value

      await authClient.forgetPassword(
        {
          email,
          redirectTo: appConfig.url + pathsConfig.auth.resetPassword,
        },
        {
          onError: ({ error: err }) => {
            setError(err.message)
            setSuccess(undefined)
          },
          onSuccess: () => {
            setError(undefined)
            setSuccess('Check your inbox for the reset link')
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
              name="email"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Email</field.FormLabel>
                  <field.FormControl>
                    <Input
                      id="email"
                      type="email"
                      name="email"
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
            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
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
