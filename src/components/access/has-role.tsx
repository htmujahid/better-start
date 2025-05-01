import type { allRoles } from '@/lib/roles'
import { useAccessControl } from '@/features/account/hooks/use-access-control'

export function HasRole({
  children,
  role,
}: {
  children: React.ReactNode
  role: keyof typeof allRoles
}) {
  const { hasRole } = useAccessControl()

  if (hasRole(role)) {
    return <>{children}</>
  }

  return null
}
