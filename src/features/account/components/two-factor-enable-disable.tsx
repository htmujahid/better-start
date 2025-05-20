import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { user as userSchema, session as sessionSchema } from "@/db/schema";
import { authClient } from "@/lib/auth-client";
import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

export function TwoFactorEnableDisable({
  session,
}: {
  session: {
    user: typeof userSchema.$inferInsert;
    session: typeof sessionSchema.$inferInsert;
  };
}) {
  const router = useRouter();
  const [twoFactorDialog, setTwoFactorDialog] = useState(false);
  const [twoFactorVerifyURI, setTwoFactorVerifyURI] = useState("");
  const [twoFaPassword, setTwoFaPassword] = useState("");
  const [isPendingTwoFa, setIsPendingTwoFa] = useState(false);

  return (
    <Dialog open={twoFactorDialog} onOpenChange={setTwoFactorDialog}>
      <DialogTrigger asChild>
        <Button
          variant={
            session?.user.twoFactorEnabled ? "destructive" : "outline"
          }
          className="gap-2"
        >
          {session?.user.twoFactorEnabled ? (
            <ShieldOff size={16} />
          ) : (
            <ShieldCheck size={16} />
          )}
          <span className="md:text-sm text-xs">
            {session?.user.twoFactorEnabled
              ? "Disable 2FA"
              : "Enable 2FA"}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-11/12">
        <DialogHeader>
          <DialogTitle>
            {session?.user.twoFactorEnabled
              ? "Disable 2FA"
              : "Enable 2FA"}
          </DialogTitle>
          <DialogDescription>
            {session?.user.twoFactorEnabled
              ? "Disable the second factor authentication from your account"
              : "Enable 2FA to secure your account"}
          </DialogDescription>
        </DialogHeader>

        {twoFactorVerifyURI ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center">
              <QRCode value={twoFactorVerifyURI} />
            </div>
            <Label htmlFor="password">
              Scan the QR code with your TOTP app
            </Label>
            <Input
              value={twoFaPassword}
              onChange={(e) => setTwoFaPassword(e.target.value)}
              placeholder="Enter OTP"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={twoFaPassword}
              onChange={(e) => setTwoFaPassword(e.target.value)}
            />
          </div>
        )}
        <DialogFooter>
          <Button
            disabled={isPendingTwoFa}
            onClick={async () => {
              if (twoFaPassword.length < 8 && !twoFactorVerifyURI) {
                toast.error("Password must be at least 8 characters");
                return;
              }
              setIsPendingTwoFa(true);
              if (session?.user.twoFactorEnabled) {
                await authClient.twoFactor.disable({
                  password: twoFaPassword,
                  fetchOptions: {
                    onError(context) {
                      toast.error(context.error.message);
                    },
                    onSuccess() {
                      toast.success("2FA disabled successfully");
                      setTwoFactorDialog(false);
                      router.invalidate();
                    },
                  },
                });
              } else {
                if (twoFactorVerifyURI) {
                  await authClient.twoFactor.verifyTotp({
                    code: twoFaPassword,
                    fetchOptions: {
                      onError(context) {
                        setIsPendingTwoFa(false);
                        setTwoFaPassword("");
                        toast.error(context.error.message);
                      },
                      onSuccess() {
                        toast("2FA enabled successfully");
                        setTwoFactorVerifyURI("");
                        setIsPendingTwoFa(false);
                        setTwoFaPassword("");
                        setTwoFactorDialog(false);
                        router.invalidate();
                      },
                    },
                  });
                  return;
                }
                await authClient.twoFactor.enable({
                  password: twoFaPassword,
                  fetchOptions: {
                    onError(context) {
                      toast.error(context.error.message);
                    },
                    onSuccess(ctx) {
                      setTwoFactorVerifyURI(ctx.data.totpURI);
                      // toast.success("2FA enabled successfully");
                      // setTwoFactorDialog(false);
                    },
                  },
                });
              }
              setIsPendingTwoFa(false);
              setTwoFaPassword("");
            }}
          >
            {isPendingTwoFa ? (
              <Loader2 size={15} className="animate-spin" />
            ) : session?.user.twoFactorEnabled ? (
              "Disable 2FA"
            ) : (
              "Enable 2FA"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}