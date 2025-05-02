import { createAccessControl } from 'better-auth/plugins/access'
import {
  adminAc,
  defaultStatements,
  userAc,
} from 'better-auth/plugins/admin/access'
import type { SubArray } from 'better-auth/plugins/access'

export type Role = keyof typeof allRoles

export type Permissions = {
  [k in keyof typeof statement]?: SubArray<(typeof statement)[k]>
}

export const statement = {
  task: ['create', 'read', 'update', 'delete'],
  ...defaultStatements,
} as const

export const ac = createAccessControl(statement)

const adminRole = ac.newRole({
  task: ['create', 'read', 'update', 'delete'],
  ...adminAc.statements,
})

const userRole = ac.newRole({
  task: ['read'],
  ...userAc.statements,
})

export const allRoles = {
  admin: adminRole,
  user: userRole,
} as const

export const rolesData = Object.keys(allRoles) as Array<Role>

export type rolesEnumData = (typeof rolesData)[number]
