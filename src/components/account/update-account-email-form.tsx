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
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { authClient } from '@/lib/auth-client'
import appConfig from '@/config/app.config'
import pathsConfig from '@/config/paths.config'

const updateEmailFormSchema = z.object({
  email: z.email('Please enter a valid email address'),
})

export function UpdateAccountEmailForm() {
  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: updateEmailFormSchema,
    },
    onSubmit: async ({ value }) => {
      const { email } = value
      await authClient.changeEmail(
        {
          newEmail: email,
          callbackURL: appConfig.url + pathsConfig.app.account,
        },
        {
          onSuccess: () => {
            toast.success('Verification email sent')
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
        <CardTitle>Account Email</CardTitle>
        <CardDescription>Update your account email below.</CardDescription>
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
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>New Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="m@example.com"
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
            <form.Subscribe
              selector={(state) => state.isSubmitting}
              children={(isSubmitting) => (
                <Button disabled={isSubmitting} className="w-fit">
                  Update Email
                </Button>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
