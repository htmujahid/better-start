import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'
import { reactStartCookies } from 'better-auth/react-start'

import { db } from '@/db' // your drizzle instance

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }) => {
      console.log('sendResetPassword', { user, url, token })
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('sendResetPassword done')
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log('sendVerificationEmail', { user, url, token })
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('sendVerificationEmail done')
    },
  },
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite"
  }),
  plugins: [admin(), reactStartCookies()],
})
