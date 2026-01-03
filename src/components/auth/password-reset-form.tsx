import { z } from 'zod'
import { useNavigate, useSearch } from '@tanstack/react-router'
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

const passwordResetSchema = z.object({
  password: z.string().min(8),
})

export function PasswordResetForm() {
  const navigate = useNavigate()
  const { token } = useSearch({ from: '/auth/reset-password/' })

  const form = useForm({
    defaultValues: {
      password: '',
    },
    validators: {
      onChange: passwordResetSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.resetPassword(
        {
          newPassword: value.password,
          token,
        },
        {
          onError: (err) => {
            toast.error(err.error.message)
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
                <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  placeholder="********"
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
            <Button className="w-full" disabled={isSubmitting}>
              Reset Password
            </Button>
          )}
        />
      </FieldGroup>
    </form>
  )
}
