import { QueryProvider } from './tanstack-query'
import { Toaster } from "@/components/ui/sonner"

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <QueryProvider>{children}</QueryProvider>
      <Toaster />
    </>
  )
}
