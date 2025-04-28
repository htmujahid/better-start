import { createAccessControl } from 'better-auth/plugins/access'
import { adminAc, defaultStatements, userAc } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements, 
} as const;

export const ac = createAccessControl(statement)

const adminRole = ac.newRole({
  ...adminAc.statements, 
})

const userRole = ac.newRole({
  ...userAc.statements,
})

export const allRoles = {
  admin: adminRole,
  user: userRole
}
