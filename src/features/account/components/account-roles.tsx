import { useAccessControl } from '../hooks/use-access-control'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function AccountRoles() {
  const { roles, getRolePermissions } = useAccessControl()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles and Permissions</CardTitle>
        <CardDescription>
          Your access rights and capabilities within the system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {roles?.map((role, roleIndex) => {
          const statements = getRolePermissions(role)
          const entities = Object.keys(statements)

          return (
            <div key={role}>
              {roleIndex > 0 && <Separator className="my-6" />}
              <div className="space-y-4">
                <h3 className="text-lg font-medium capitalize">{role}</h3>

                {entities.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No permissions defined for this role
                  </p>
                ) : (
                  <div className="space-y-4">
                    {entities.map((entity) => {
                      const permissions =
                        statements[entity as keyof typeof statements] || []

                      return (
                        <div key={entity} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium capitalize">
                              {entity}
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {permissions.map((permission) => (
                              <Badge
                                key={permission}
                                variant="secondary"
                                className="text-xs"
                              >
                                {permission}
                              </Badge>
                            ))}
                            {permissions.length === 0 && (
                              <p className="text-sm text-muted-foreground">
                                No permissions defined for this entity
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
