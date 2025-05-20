import CopyButton from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Loader2, QrCode } from "lucide-react";
import { useState, useTransition } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

export function TwoFactorScanQrCode() {
  const [isLoading, startTransition] = useTransition();
  const [twoFactorVerifyURI, setTwoFactorVerifyURI] = useState("");
  const [twoFaPassword, setTwoFaPassword] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <QrCode size={16} />
          <span className="md:text-sm text-xs">Scan QR Code</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-11/12">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
          <DialogDescription>
            Scan the QR code with your TOTP app
          </DialogDescription>
        </DialogHeader>

        {twoFactorVerifyURI ? (
          <>
            <div className="flex items-center justify-center">
              <QRCode value={twoFactorVerifyURI} />
            </div>
            <div className="flex gap-2 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Copy URI to clipboard
              </p>
              <CopyButton textToCopy={twoFactorVerifyURI} />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <Input
              type="password"
              value={twoFaPassword}
              onChange={(e) => setTwoFaPassword(e.target.value)}
              placeholder="Enter Password"
            />
            <Button
              onClick={async () => {
                if (twoFaPassword.length < 8) {
                  toast.error(
                    "Password must be at least 8 characters",
                  );
                  return;
                }
                startTransition(async () => {
                  await authClient.twoFactor.getTotpUri(
                    {
                      password: twoFaPassword,
                  },
                  {
                    onSuccess(context) {
                      setTwoFactorVerifyURI(context.data.totpURI);
                    },
                  },
                  );
                  setTwoFaPassword("");
                });
              }}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Show QR Code"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
