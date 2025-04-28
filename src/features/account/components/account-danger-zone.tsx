"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

export function AccountDangerZone() {
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")

  const handleDeleteAccount = async () => {
    await authClient.deleteUser({}, {
      onSuccess: () => {
        toast.success("Account deletion initiated", {
          description: "Please check your email for a verification link to delete your account.",
        })
        setOpen(false)
      },
      onError: () => {
        toast.error("Failed to delete account", {
          description: "Please try again.",
        })
        setOpen(false)
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
        <CardDescription>Actions in this section cannot be reversed.</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="font-medium">Delete Account</h3>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Your account and all associated data will be permanently deleted.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  To confirm, type <span className="font-bold">delete</span> in the field below:
                </p>
                <div className="space-y-1">
                  <Label htmlFor="confirm">Confirmation</Label>
                  <Input id="confirm" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
                  {confirmText && confirmText !== "delete" && (
                    <p className="text-xs text-destructive">Please type "delete" exactly to confirm</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount} disabled={confirmText !== "delete"}>
                Permanently Delete Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
