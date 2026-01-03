import { createServerFn } from '@tanstack/react-start'
import { getCookie, getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'

export const sessionsAction = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()

    const sessionToken = getCookie('better-auth.session_token') as string

    const sessionId = sessionToken?.split('.')[0]

    const sessions = await auth.api.listSessions({
      headers,
    })
    return {
      sessions,
      sessionId,
    }
  },
)
