import { z } from 'zod'
import { Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { authClient } from '@/lib/auth-client'
import appConfig from '@/config/app.config'
import pathsConfig from '@/config/paths.config'

const forgotPasswordFormSchema = z.object({
  email: z.email(),
})

export function ForgotPasswordForm() {
  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: forgotPasswordFormSchema,
    },
    onSubmit: async ({ value }) => {
      const { email } = value

      await authClient.requestPasswordReset(
        {
          email,
          redirectTo: appConfig.url + pathsConfig.auth.resetPassword,
        },
        {
          onError: ({ error: err }) => {
            toast.error(err.message)
          },
          onSuccess: () => {
            toast.success('Check your inbox for the reset link')
          },
        },
      )
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  type="email"
                  name={field.name}
                  placeholder="m@example.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <Button type="submit" className="w-full">
          Send Reset Link
        </Button>
        <div className="text-center text-sm">
          Want to go back?{' '}
          <Link to="/auth/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </FieldGroup>
    </form>
  )
}
