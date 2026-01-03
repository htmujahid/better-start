import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { authClient } from '@/lib/auth-client'
import { Checkbox } from '@/components/ui/checkbox'

const updatePasswordSchema = z.object({
  current_password: z.string().min(8),
  new_password: z.string().min(8),
  revoke_other_sessions: z.boolean(),
})

export function UpdateAccountPasswordForm() {
  const form = useForm({
    defaultValues: {
      current_password: '',
      new_password: '',
      revoke_other_sessions: true,
    },
    validators: {
      onChange: updatePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      const { current_password, new_password, revoke_other_sessions } = value
      await authClient.changePassword(
        {
          currentPassword: current_password,
          newPassword: new_password,
          revokeOtherSessions: revoke_other_sessions,
        },
        {
          onSuccess: () => {
            toast.success('Password updated successfully')
            form.reset()
          },
          onError: ({ error }) => {
            toast.error(error.message)
          },
        },
      )
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Password</CardTitle>
        <CardDescription>Update your account password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="current_password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Current Password
                    </FieldLabel>
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="new_password"
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="revoke_other_sessions"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid}>
                    <Checkbox
                      id={field.name}
                      name={field.name}
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked === true)
                      }
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    <div className="space-y-1 leading-none">
                      <FieldLabel htmlFor={field.name}>
                        Revoke other sessions
                      </FieldLabel>
                      <FieldDescription>
                        Sign out from all other devices when changing password
                      </FieldDescription>
                    </div>
                  </Field>
                )
              }}
            />
            <form.Subscribe
              selector={(state) => state.isSubmitting}
              children={(isSubmitting) => (
                <Button className="w-full" disabled={isSubmitting}>
                  Update Password
                </Button>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
