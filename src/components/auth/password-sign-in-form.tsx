import { z } from 'zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { authClient } from '@/lib/auth-client'
import pathsConfig from '@/config/paths.config'

const signInFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  rememberMe: z.boolean(),
})

export function SignInForm() {
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
    validators: {
      onChange: signInFormSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          rememberMe: value.rememberMe,
        },
        {
          onError: (err) => {
            toast.error(err.error.message)
          },
          onSuccess: (ctx) => {
            if (ctx.data.twoFactorRedirect) {
              navigate({
                to: pathsConfig.auth.twoFactor,
                replace: true,
              })
            } else {
              navigate({
                to: pathsConfig.app.home,
                replace: true,
              })
            }
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
                  name={field.name}
                  type="email"
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
        <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <div className="flex items-center">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Link
                    to="/auth/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
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
        <form.Field
          name="rememberMe"
          children={(field) => (
            <Field orientation="horizontal">
              <Checkbox
                id={field.name}
                name={field.name}
                checked={field.state.value}
                onCheckedChange={(checked) =>
                  field.handleChange(checked === true)
                }
              />
              <FieldLabel htmlFor={field.name} className="font-normal">
                Remember me
              </FieldLabel>
            </Field>
          )}
        />
        <form.Subscribe
          selector={(state) => state.isSubmitting}
          children={(isSubmitting) => (
            <Button className="w-full" disabled={isSubmitting}>
              Sign In
            </Button>
          )}
        />
      </FieldGroup>
    </form>
  )
}
