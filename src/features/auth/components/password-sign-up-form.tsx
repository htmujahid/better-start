import { useState } from 'react'
import { z } from 'zod'

import { AuthSuccess } from './auth-success'
import { AuthError } from './auth-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { If } from '@/components/if'
import appConfig from '@/config/app.config'
import pathsConfig from '@/config/paths.config'
import { useAppForm } from '@/core/form-builder/form'

const signUpFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

export function SignUpForm() {
  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
    validators: {
      onChange: signUpFormSchema,
    },
    onSubmit: async ({ value }) => {
      const { email, password, name } = value

      await authClient.signUp.email(
        {
          email,
          password,
          name,
          callbackURL: appConfig.url + pathsConfig.app.home,
        },
        {
          onError: ({ error: err }) => {
            setError(err.message)
            setSuccess(undefined)
          },
          onSuccess: () => {
            setError(undefined)
            setSuccess(
              'Account created successfully. Please check your email to verify your account.',
            )
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
        className="grid gap-6"
      >
        <div className="grid gap-3">
          <If condition={error}>{(data) => <AuthError error={data} />}</If>
          <If condition={success}>
            {(data) => <AuthSuccess message={data} />}
          </If>
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
          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Sign Up
              </Button>
            )}
          />
        </div>
      </form>
    </form.AppForm>
  )
}
