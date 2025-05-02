'use client'

import * as React from 'react'
import { CheckCircle2, Text, XCircle } from 'lucide-react'

import { Link } from '@tanstack/react-router'

import { UserListActions } from './users-list-actions'

import { UserCreateDialog } from './user-create'
import type { Column, ColumnDef } from '@tanstack/react-table'

import type { User } from '@/db/schema/auth-schema'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useDataTable } from '@/hooks/use-data-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function UsersList({
  data,
  pageCount,
}: {
  data: Array<User>
  pageCount: number
}) {
  const columns = React.useMemo<Array<ColumnDef<User>>>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 0,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: 'name',
        accessorKey: 'name',
        header: ({ column }: { column: Column<User, unknown> }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => (
          <Link
            className="flex items-center gap-3"
            to={'/admin/users/$userId'}
            params={{
              userId: row.original.id,
            }}
          >
            <Avatar>
              <AvatarImage
                src={row.original.image ?? ''}
                alt={row.original.name ?? ''}
              />
              <AvatarFallback>
                {row.original.name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{row.original.name}</div>
              <span className="text-muted-foreground mt-0.5 text-xs">
                {row.original.email.split('@')[0]}
              </span>
            </div>
          </Link>
        ),
        meta: {
          label: 'Name',
          placeholder: 'Search name...',
          variant: 'text',
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: 'email',
        accessorKey: 'email',
        header: ({ column }: { column: Column<User, unknown> }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ cell }) => {
          const email = cell.getValue<User['email']>()

          return <div>{email}</div>
        },
      },
      {
        id: 'emailVerified',
        accessorKey: 'emailVerified',
        header: ({ column }: { column: Column<User, unknown> }) => (
          <DataTableColumnHeader column={column} title="Email Verified" />
        ),
        cell: ({ cell }) => {
          const emailVerified = cell.getValue<User['emailVerified']>()
          const Icon = emailVerified ? CheckCircle2 : XCircle

          return (
            <Badge variant="outline" className="capitalize">
              <Icon />
              {emailVerified ? 'Yes' : 'No'}
            </Badge>
          )
        },
      },
      {
        id: 'banned',
        accessorKey: 'banned',
        header: ({ column }: { column: Column<User, unknown> }) => (
          <DataTableColumnHeader column={column} title="Banned" />
        ),
        cell: ({ cell }) => {
          const banned = cell.getValue<User['banned']>()
          const Icon = banned ? CheckCircle2 : XCircle

          return (
            <Badge variant="outline" className="capitalize">
              <Icon />
              {banned ? 'Yes' : 'No'}
            </Badge>
          )
        },
      },
      {
        id: 'role',
        accessorKey: 'role',
        header: ({ column }: { column: Column<User, unknown> }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ cell }) => {
          const role = cell.getValue<User['role']>()

          return <div className="flex items-center gap-1">{role}</div>
        },
        meta: {
          label: 'Role',
          variant: 'select',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'User', value: 'user' },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: 'createdAt',
        accessorKey: 'createdAt',
        header: ({ column }: { column: Column<User, unknown> }) => (
          <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ cell }) => {
          const createdAt = cell.getValue<User['createdAt']>()

          return (
            <div>
              {createdAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          )
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => <UserListActions row={row} />,
        size: 32,
      },
    ],
    [],
  )

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (row) => row.id,
  })

  return (
    <div className="data-table-container">
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          <UserCreateDialog />
        </DataTableToolbar>
      </DataTable>
    </div>
  )
}
