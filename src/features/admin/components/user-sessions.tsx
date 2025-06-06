'use client'

import { useState } from 'react'
import {
  AlertCircle,
  Laptop,
  LogOut,
  Shield,
  Smartphone,
  Tablet,
} from 'lucide-react'
import { toast } from 'sonner'
import { UAParser } from 'ua-parser-js'
import { useRouter } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { authClient } from '@/lib/auth-client'

type Session = {
  id: string
  createdAt: Date
  updatedAt: Date
  userId: string
  expiresAt: Date
  token: string
  ipAddress?: string | null | undefined
  userAgent?: string | null | undefined
}

export function UserSessions({
  sessions,
  sessionId,
  userId,
}: {
  sessions: Array<Session>
  sessionId: string
  userId: string
}) {
  const router = useRouter()
  const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null)

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'laptop':
        return <Laptop className="h-4 w-4" />
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'tablet':
        return <Tablet className="h-4 w-4" />
      default:
        return <Laptop className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Active Sessions</CardTitle>
            <CardDescription>
              Manage your active sessions across devices
            </CardDescription>
          </div>
          <Shield className="h-6 w-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No active sessions found</p>
          </div>
        ) : (
          sessions.map((session) => {
            const userAgent = session.userAgent
              ? new UAParser(session.userAgent)
              : null

            return (
              <div key={session.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-md bg-secondary p-2">
                      {getDeviceIcon(userAgent?.getDevice().type ?? 'laptop')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {userAgent?.getDevice().model} (
                          {userAgent?.getDevice().vendor ?? 'Unknown'})
                        </p>
                        {sessionId === session.token && (
                          <Badge variant="outline" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {userAgent?.getBrowser().name} •{' '}
                        {userAgent?.getBrowser().version}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        IP: {!session.ipAddress ? 'Unknown' : session.ipAddress}{' '}
                        • {session.createdAt.toDateString()}
                      </p>
                    </div>
                  </div>
                  <AlertDialog
                    open={sessionToRevoke === session.id}
                    onOpenChange={(open) => !open && setSessionToRevoke(null)}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setSessionToRevoke(session.id)}
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Revoke
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Revoke Session</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to revoke this session? This
                          will sign out the device and require
                          re-authentication.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-background hover:bg-destructive/90"
                          onClick={async () => {
                            const { error } =
                              await authClient.admin.revokeUserSession({
                                sessionToken: session.token,
                              })

                            if (error) {
                              toast.error(error.message)
                            } else {
                              toast.success('Session revoked successfully')
                              router.invalidate()
                            }
                          }}
                        >
                          Revoke
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Separator className="mt-4" />
              </div>
            )
          })
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Last checked: {new Date().toDateString()}
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={sessions.length === 0}
            >
              Revoke All Sessions
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revoke All Sessions</AlertDialogTitle>
              <AlertDialogDescription>
                This will sign you out from all devices except your current one.
                You'll need to sign in again on those devices.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-background hover:bg-destructive/90"
                onClick={async () => {
                  const { error } = await authClient.admin.revokeUserSessions({
                    userId,
                  })

                  if (error) {
                    toast.error(error.message)
                  } else {
                    toast.success('All sessions revoked successfully')
                    router.invalidate()
                  }
                }}
              >
                Revoke All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
