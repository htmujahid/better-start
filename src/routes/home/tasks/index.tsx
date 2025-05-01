import { createFileRoute, redirect } from '@tanstack/react-router'
import { allRoles } from '@/lib/roles'

type AuthorizeFunction = (typeof allRoles)[keyof typeof allRoles]['authorize']

function hasPermissionPage(
  role?: string | null,
  ...args: Parameters<AuthorizeFunction>
) {
  if (!role) {
    throw new Error('No role found')
  }

  const roleArr = role.split(',') as Array<keyof typeof allRoles>

  let check = false

  roleArr.forEach((r) => {
    if (allRoles[r].authorize(...args).success) {
      check = true
    }
  })

  if (!check) {
    throw redirect({
      to: '/errors/403',
    })
  }
  return true
}

export const Route = createFileRoute('/home/tasks/')({
  beforeLoad: ({ context }) => {
    hasPermissionPage(context.user?.role, { task: ['read'] })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <span>tasks</span>
    </div>
  )
}
