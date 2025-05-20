import { z } from 'zod'

const PathsSchema = z.object({
  auth: z.object({
    signIn: z.string().min(1),
    signUp: z.string().min(1),
    forgotPassword: z.string().min(1),
    resetPassword: z.string().min(1),
  }),
  app: z.object({
    home: z.string().min(1),
    account: z.string().min(1),
    security: z.string().min(1),
  }),
  admin: z.object({
    users: z.string().min(1),
  }),
})

const pathsConfig = PathsSchema.parse({
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  app: {
    home: '/home',
    account: '/home/account',
    security: '/home/security',
  },
  admin: {
    users: '/admin/users',
  },
} satisfies z.infer<typeof PathsSchema>)

export default pathsConfig
