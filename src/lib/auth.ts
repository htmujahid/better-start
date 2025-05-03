import { betterAuth } from 'better-auth'
import { Resend } from 'resend';
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, multiSession } from 'better-auth/plugins'
import { reactStartCookies } from 'better-auth/react-start'

import { ac, allRoles } from './roles'
import { db } from '@/db'
import { mailConfig } from '@/config/mail.config';

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
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
        await resend.emails.send({
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
        await resend.emails.send({
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
      await resend.emails.send({
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
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite"
  }),
  plugins: [
    admin({
      ac,
      roles: allRoles,
    }),
    multiSession(),
    reactStartCookies(),
  ],
})
