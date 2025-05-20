'use client';

import { useState, useTransition } from "react";
import { useRouter } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useAppForm } from "@/core/form-builder/form";

export const otpSchema = z.object({
  code: z
    .string()
    .length(6, 'OTP code must be 6 digits')
    .regex(/^\d+$/, 'OTP code must contain only digits'),
});

export type OtpSchema = z.infer<typeof otpSchema>;

export function OtpForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  // In a real app, this email would come from your authentication context
  const userEmail = "user@example.com";

  const form = useAppForm({
    defaultValues: {
      code: "",
    },
    validators: {
      onChange: otpSchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        const res = await authClient.twoFactor.verifyOtp({
          code: value.code,
        });

        if (res.data) {
          setMessage("OTP validated successfully");
          setIsError(false);
          setIsValidated(true);
          router.invalidate();
        } else {
          setIsError(true);
          setMessage("Invalid OTP");
        }
      });
    },
  });

  const requestOTP = async () => {
    startTransition(async () => {
      await authClient.twoFactor.sendOtp();
      setMessage("OTP sent to your email");
      setIsError(false);
      setIsOtpSent(true);
    });
  };

  return (
    <div className="grid w-full items-center gap-4">
      {!isOtpSent ? (
        <Button onClick={requestOTP} className="w-full" disabled={pending}>
          {pending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          Send OTP to Email
        </Button>
      ) : (
        <form.AppForm>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <div className="flex flex-col space-y-1.5">
              <form.AppField
                name="code"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>One-Time Password</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
              <p className="text-sm text-muted-foreground">
                Check your email at {userEmail} for the OTP
              </p>
            </div>
            <form.Subscribe
              selector={(state) => state.isSubmitting}
              children={(isSubmitting) => (
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || isValidated}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Validate OTP
                </Button>
              )}
            />
          </form>
        </form.AppForm>
      )}
      {message && (
        <div
          className={`flex items-center gap-2 mt-4 ${
            isError ? "text-red-500" : "text-primary"
          }`}
        >
          {isError ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          <p className="text-sm">{message}</p>
        </div>
      )}
    </div>
  );
}
