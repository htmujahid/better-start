import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";
import { useRouter } from "@tanstack/react-router";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useAppForm } from "@/core/form-builder/form";
import { AuthError } from "./auth-error";
import { If } from "@/components/if";

export const totpSchema = z.object({
  code: z
    .string()
    .length(6, 'TOTP code must be 6 digits')
    .regex(/^\d+$/, 'TOTP code must contain only digits'),
});

export type TotpSchema = z.infer<typeof totpSchema>;

export function TwoFactorForm() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const form = useAppForm({
    defaultValues: {
      code: "",
    },
    validators: {
      onChange: totpSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await authClient.twoFactor.verifyTotp({
        code: value.code,
      });

      if (res.data?.token) {
        setSuccess(true);
        router.invalidate();
      } else {
        setError("Invalid TOTP code");
      }
    },
  });

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
        <p className="text-lg font-semibold">Verification Successful</p>
      </div>
    )
  }

  return (
    <form.AppForm>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <If condition={error}>{(data) => <AuthError error={data} />}</If>
        <form.AppField
          name="code"
          children={(field) => (
            <field.FormItem>
              <field.FormLabel>TOTP Code</field.FormLabel>
              <field.FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Verify'}
            </Button>
          )}
        />
      </form>
    </form.AppForm>
  )
}