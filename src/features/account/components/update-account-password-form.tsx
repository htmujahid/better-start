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
import { Checkbox } from '@/components/ui/checkbox'

const updatePasswordSchema = z.object({
  current_password: z.string().min(8),
  new_password: z.string().min(8),
  revoke_other_sessions: z.boolean(),
})

export function UpdateAccountPasswordForm() {
  const form = useAppForm({
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
                name="current_password"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Current Password</field.FormLabel>
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
                name="new_password"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>New Password</field.FormLabel>
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
                name="revoke_other_sessions"
                children={(field) => (
                  <field.FormItem className="flex flex-row items-start space-y-0">
                    <field.FormControl>
                      <Checkbox
                        defaultChecked={field.state.value}
                        checked={field.state.value}
                        onCheckedChange={(checked) =>
                          field.handleChange(checked === true)
                        }
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <div className="space-y-1.5 leading-none">
                      <field.FormLabel>Revoke other sessions</field.FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Sign out from all other devices when changing password
                      </p>
                    </div>
                  </field.FormItem>
                )}
              />
              <form.Subscribe
                selector={(state) => state.isSubmitting}
                children={(isSubmitting) => (
                  <Button className="w-full" disabled={isSubmitting}>
                    Update Password
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
