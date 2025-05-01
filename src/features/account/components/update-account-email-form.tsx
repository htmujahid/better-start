import { toast } from 'sonner'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppForm } from '@/core/form-builder/form'
import { authClient } from '@/lib/auth-client'
import appConfig from '@/config/app.config'
import pathsConfig from '@/config/paths.config'

const updateEmailFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export function UpdateAccountEmailForm() {
  const form = useAppForm({
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
        <form.AppForm>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <div className="grid gap-3">
              <form.AppField
                name="email"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>New Email</field.FormLabel>
                    <field.FormControl>
                      <Input
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
              <form.Subscribe
                selector={(state) => state.isSubmitting}
                children={(isSubmitting) => (
                  <Button disabled={isSubmitting} className="w-fit">
                    Update Email
                  </Button>
                )}
              />
            </div>
          </form>
        </form.AppForm>
      </CardContent>
    </Card>
  )
}
