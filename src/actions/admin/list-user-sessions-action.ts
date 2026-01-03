import { createServerFn } from '@tanstack/react-start'
import { getCookie, getRequestHeaders } from '@tanstack/react-start/server'
import z from 'zod'
import { auth } from '@/lib/auth'

export const listUserSessionsAction = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()

    const sessionToken = getCookie('better-auth.session_token') as string

    const sessionId = sessionToken?.split('.')[0]

    const { sessions } = await auth.api.listUserSessions({
      headers,
      body: data,
    })

    return {
      sessions,
      sessionId,
    }
  })
