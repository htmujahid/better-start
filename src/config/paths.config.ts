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
  },
} satisfies z.infer<typeof PathsSchema>)

export default pathsConfig
