import { z } from 'zod'
import { Link, useSearch } from '@tanstack/react-router'
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
  const { token } = useSearch({
    from: '/auth/reset-password/',
  })

  const form = useForm({
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
            toast.error(err.message)
          },
          onSuccess: () => {
            toast.success('Password reset successfully')
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
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
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
        <form.Field
          name="confirm_password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
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
        <form.Subscribe
          selector={(state) => state.isSubmitting}
          children={(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting} className="w-full">
              Reset Password
            </Button>
          )}
        />
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
