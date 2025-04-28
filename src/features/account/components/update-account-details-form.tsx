import { toast } from 'sonner';
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppForm } from '@/core/form-builder/form'
import { authClient } from '@/lib/auth-client';

const updateAccountFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

export function UpdateAccountDetailsForm() {
  const form = useAppForm({
    defaultValues: {
      name: '',
    },
    validators: {
      onChange: updateAccountFormSchema,
    },
    onSubmit: async ({ value }) => {
      const { name } = value
      await authClient.updateUser({
        name,
      }, {
        onSuccess: () => {
          toast.success('Account details updated successfully')
          form.reset()
        },
        onError: ({ error }) => {
          toast.error(error.message)
        },
      })
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
        <CardDescription>
          Update your account details below.
        </CardDescription>
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
                name="name"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Name</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="John Doe"
                        type="text"
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
                  <Button disabled={isSubmitting} className='w-fit'>
                    Update Account
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