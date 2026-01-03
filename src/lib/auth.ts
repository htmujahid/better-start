import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, twoFactor } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { env } from 'cloudflare:workers'

import { ac, allRoles } from './roles'
import { sendMail } from '@/lib/mailer'

import { db } from '@/db'
import mailConfig from '@/config/mail.config'
import appConfig from '@/config/app.config'

export const auth = betterAuth({
  appName: appConfig.name,
  baseURL: appConfig.url,
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  secondaryStorage: {
    get: async (key) => {
      return JSON.parse((await env.better_start_kv.get(key)) as string)
    },
    set: async (key, value, ttl) => {
      if (ttl !== undefined) {
        // Cloudflare KV requires TTL >= 60 seconds
        const minTtl = 60
        if (ttl < minTtl) {
          console.warn(
            `[BetterAuthCloudflare] TTL ${ttl}s is less than KV minimum of ${minTtl}s. Using ${minTtl}s instead.`,
          )
          ttl = minTtl
        }
        await env.better_start_kv.put(key, JSON.stringify(value), {
          expirationTtl: ttl,
        })
      } else {
        await env.better_start_kv.put(key, JSON.stringify(value))
      }
    },
    delete: async (key) => {
      await env.better_start_kv.delete(key)
    },
  },
  rateLimit: {
    enabled: true,
    storage: 'secondary-storage',
    customStorage: {
      get: async (key) => {
        return JSON.parse((await env.better_start_kv.get(key)) as string)
      },
      set: async (key, value) => {
        await env.better_start_kv.put(key, JSON.stringify(value))
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendMail({
        from: mailConfig.from,
        to: user.email,
        subject: 'Reset Password',
        html: `
          <p>Hi ${user.name},</p>
          <p>Click <a href="${url}">here</a> to reset your password</p>
          <p>Or copy and paste the link below into your browser:</p>
          <p>${url}</p>
        `,
      })
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      requireVerification: true,
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        await sendMail({
          from: mailConfig.from,
          to: user.email,
          subject: 'Change Email',
          html: `
            <p>Hi ${user.name},</p>
            <p>Click <a href="${url}">here</a> to change your email to ${newEmail}</p>
            <p>Or copy and paste the link below into your browser:</p>
            <p>${url}</p>
          `,
        })
      },
    },
    deleteUser: {
      enabled: true,
      deleteSessions: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendMail({
          from: mailConfig.from,
          to: user.email,
          subject: 'Delete Account',
          html: `
            <p>Hi ${user.name},</p>
            <p>Click <a href="${url}">here</a> to delete your account</p>
            <p>Or copy and paste the link below into your browser:</p>
            <p>${url}</p>
          `,
        })
      },
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendMail({
        from: mailConfig.from,
        to: user.email,
        subject: 'Verify Email',
        html: `
          <p>Hi ${user.name},</p>
          <p>Click <a href="${url}">here</a> to verify your email</p>
          <p>Or copy and paste the link below into your browser:</p>
          <p>${url}</p>
        `,
      })
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
  plugins: [
    admin({
      ac,
      roles: allRoles,
    }),
    twoFactor({
      otpOptions: {
        sendOTP: async ({ user, otp }) => {
          await sendMail({
            from: mailConfig.from,
            to: user.email,
            subject: 'OTP',
            html: `
              <p>Hi ${user.name},</p>
              <p>Your OTP is ${otp}</p>
            `,
          })
        },
      },
    }),
    tanstackStartCookies(),
  ],
})
