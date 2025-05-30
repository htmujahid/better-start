import { createAuthClient } from 'better-auth/react'
import { adminClient, twoFactorClient } from 'better-auth/client/plugins'
import { ac, allRoles } from './roles'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BASE_URL,
  plugins: [
    adminClient({
      ac,
      roles: allRoles,
    }),
    twoFactorClient(),
  ],
})
