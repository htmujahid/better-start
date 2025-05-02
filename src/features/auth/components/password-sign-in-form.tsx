import { useState } from 'react'
import { z } from 'zod'
import { Link, useNavigate } from '@tanstack/react-router'

import { AuthError } from './auth-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { authClient } from '@/lib/auth-client'
import { If } from '@/components/if'
import { useAppForm } from '@/core/form-builder/form'

const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean(),
})

export function SignInForm() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | undefined>(undefined)

  const form = useAppForm({
    defaultValues: {
      email: 'test@better-auth.com',
      password: '12345678',
      rememberMe: true,
    },
    validators: {
      onChange: signInFormSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          rememberMe: value.rememberMe,
        },
        {
          onError: (err) => {
            setError(err.error.message)
          },
          onSuccess: () => {
            navigate({
              to: '/home',
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
                <field.FormLabel>Username</field.FormLabel>
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
          <form.AppField
            name="password"
            children={(field) => (
              <field.FormItem>
                <div className="flex items-center">
                  <field.FormLabel htmlFor="password">Password</field.FormLabel>
                  <Link
                    to="/auth/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>{' '}
                <field.FormControl>
                  <Input
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
            name="rememberMe"
            children={(field) => (
              <field.FormItem className="flex flex-row items-start">
                <field.FormControl>
                  <Checkbox
                    checked={field.state.value}
                    onCheckedChange={(checked) =>
                      field.handleChange(checked === true)
                    }
                  />
                </field.FormControl>
                <field.FormLabel>Remember me</field.FormLabel>
              </field.FormItem>
            )}
          />
          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <Button className="w-full" disabled={isSubmitting}>
                Sign In
              </Button>
            )}
          />
        </div>
      </form>
    </form.AppForm>
  )
}
