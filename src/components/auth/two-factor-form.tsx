import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { z } from 'zod'
import { useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { authClient } from '@/lib/auth-client'

export const totpSchema = z.object({
  code: z
    .string()
    .length(6, 'TOTP code must be 6 digits')
    .regex(/^\d+$/, 'TOTP code must contain only digits'),
})

export type TotpSchema = z.infer<typeof totpSchema>

export function TwoFactorForm() {
  const router = useRouter()
  const [success, setSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      code: '',
    },
    validators: {
      onChange: totpSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await authClient.twoFactor.verifyTotp({
        code: value.code,
      })

      if (res.data?.token) {
        setSuccess(true)
        router.invalidate()
      } else {
        toast.error('Invalid TOTP code')
      }
    },
  })

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
        <p className="text-lg font-semibold">Verification Successful</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <form.Field
          name="code"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>TOTP Code</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                'Verify'
              )}
            </Button>
          )}
        />
      </FieldGroup>
    </form>
  )
}
