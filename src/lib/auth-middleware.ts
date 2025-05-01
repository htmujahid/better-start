import { getWebRequest } from '@tanstack/react-start/server'
import { createMiddleware, json } from '@tanstack/react-start'

import { auth } from './auth'
import type { Permissions, Role } from './roles'

export function authMiddleware(
  args?:
    | {
        permissions: Permissions
        role?: never
      }
    | {
        role: Role
        permissions?: never
      },
) {
  return createMiddleware().server(async ({ next }) => {
    const { headers } = getWebRequest()!
    try {
      if (!args?.permissions) {
        const data = await auth.api.getSession({
          headers,
        })

        const user = data?.user
        const userRole = user?.role?.split(',')

        if (!args?.role || userRole?.includes(args?.role)) {
          return next()
        }
        throw new Error('Unauthorized')
      }

      const is = await auth.api.userHasPermission({
        body: {
          permissions: args?.permissions,
        },
        headers,
      })
      if (is.success) {
        return next()
      }
      throw new Error('Unauthorized')
    } catch (error) {
      throw json(
        {
          message: 'Unauthorized',
        },
        {
          status: 401,
        },
      )
    }
  })
}
