import { useCallback, useMemo } from 'react'
import { useUser } from './use-user'
import { allRoles } from '@/lib/roles'

type AuthorizeFunction = (typeof allRoles)[keyof typeof allRoles]['authorize']

export function useAccessControl() {
  const { user } = useUser()

  const roles = useMemo(() => {
    return user?.role?.split(',') as Array<keyof typeof allRoles>
  }, [user?.role])

  const hasPermission = useCallback(
    (...args: Parameters<AuthorizeFunction>) => {
      let check = false
      roles.forEach((role) => {
        if (allRoles[role].authorize(...args).success) {
          check = true
        }
      })
      return check
    },
    [roles],
  )

  const hasRole = useCallback(
    (role: keyof typeof allRoles) => {
      return roles.includes(role)
    },
    [roles],
  )

  const getRolePermissions = useCallback((role: keyof typeof allRoles) => {
    return allRoles[role].statements
  }, [])

  return {
    roles,
    hasPermission,
    hasRole,
    getRolePermissions,
  }
}
