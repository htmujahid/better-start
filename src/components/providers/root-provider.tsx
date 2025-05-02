import { NuqsAdapter } from 'nuqs/adapters/react'

import { QueryProvider } from './tanstack-query'
import { Toaster } from '@/components/ui/sonner'

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NuqsAdapter>
        <QueryProvider>{children}</QueryProvider>
      </NuqsAdapter>
      <Toaster />
    </>
  )
}
