import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'

export const sessionAction = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const response = await auth.api.getSession({ headers })

    return {
      session: response?.session,
      user: response?.user,
    }
  },
)
