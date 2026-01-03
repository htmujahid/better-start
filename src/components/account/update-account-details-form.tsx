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

const updateAccountFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

export function UpdateAccountDetailsForm() {
  const form = useForm({
    defaultValues: {
      name: '',
    },
    validators: {
      onChange: updateAccountFormSchema,
    },
    onSubmit: async ({ value }) => {
      const { name } = value
      await authClient.updateUser(
        {
          name,
        },
        {
          onSuccess: () => {
            toast.success('Account details updated successfully')
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
        <CardTitle>Account Details</CardTitle>
        <CardDescription>Update your account details below.</CardDescription>
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
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="John Doe"
                      type="text"
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
                  Update Account
                </Button>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
