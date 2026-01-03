'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { UserCreateDialog } from './user-create'
import { getUsersListColumns } from './users-list-columns'
import type { ColumnDef } from '@tanstack/react-table'

import type {DataTableSearchParams} from '@/hooks/use-data-table';
import type { UserWithRole } from 'better-auth/plugins'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { DataTable } from '@/components/data-table'
import {
  
  useDataTable
} from '@/hooks/use-data-table'

interface UsersListProps {
  data: Array<UserWithRole>
  pageCount: number
  search: DataTableSearchParams
}

export function UsersList({ data, pageCount, search }: UsersListProps) {
  const columns = React.useMemo<Array<ColumnDef<UserWithRole>>>(
    () => getUsersListColumns(),
    [],
  )

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    search,
    filterColumns: {
      name: 'name',
      role: 'role',
    },
  })

  return (
    <DataTable table={table}>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <UserCreateDialog />
        </div>
      </div>
    </DataTable>
  )
}
