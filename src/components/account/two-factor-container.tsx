'use client'

import { TwoFactorEnableDisable } from './two-factor-enable-disable'
import { TwoFactorScanQrCode } from './two-factor-scan-qr-code'
import type { authClient } from '@/lib/auth-client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { If } from '@/components/misc/if'

export function TwoFactorContainer({
  session,
}: {
  session: typeof authClient.$Infer.Session
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Factor Authentication</CardTitle>
        <CardDescription>
          Set up Multi-Factor Authentication method to further secure your
          account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <If condition={!!session.user.twoFactorEnabled}>
          <TwoFactorScanQrCode />
        </If>
        <TwoFactorEnableDisable session={session} />
      </CardContent>
    </Card>
  )
}
