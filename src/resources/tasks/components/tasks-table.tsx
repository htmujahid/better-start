'use client'

import * as React from 'react'
import { useRouter } from '@tanstack/react-router'

import { DeleteTasksDialog } from './delete-tasks-dialog'
import { TasksTableActionBar } from './tasks-table-action-bar'
import { getTasksTableColumns } from './tasks-table-columns'
import { UpdateTaskSheet } from './update-task-sheet'
import { TasksTableToolbarActions } from './tasks-table-toolbar-actions'

import type { Task } from '@/db/schema'
import type { DataTableRowAction } from '@/types/data-table'

import type { tasksApi } from '../tasks-api'

import { DataTable } from '@/components/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'

import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'

interface TasksTableProps {
  promises: [
    Awaited<ReturnType<typeof tasksApi.getAll>>,
    Awaited<ReturnType<typeof tasksApi.getStatusCounts>>,
    Awaited<ReturnType<typeof tasksApi.getPriorityCounts>>,
    Awaited<ReturnType<typeof tasksApi.getEstimatedHoursRange>>,
  ]
}

export function TasksTable({ promises }: TasksTableProps) {
  const [
    { data, pageCount },
    statusCounts,
    priorityCounts,
    estimatedHoursRange,
  ] = promises
  const router = useRouter()

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Task> | null>(null)

  const columns = React.useMemo(
    () =>
      getTasksTableColumns({
        statusCounts,
        priorityCounts,
        estimatedHoursRange,
        setRowAction,
        router,
      }),
    [statusCounts, priorityCounts, estimatedHoursRange],
  )

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    enableAdvancedFilter: false,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  })

  return (
    <>
      <DataTable
        table={table}
        actionBar={<TasksTableActionBar table={table} />}
      >
        <DataTableToolbar table={table}>
          <TasksTableToolbarActions table={table} />
          <DataTableSortList table={table} align="end" />
        </DataTableToolbar>
      </DataTable>
      <UpdateTaskSheet
        open={rowAction?.variant === 'update'}
        onOpenChange={() => setRowAction(null)}
        data={rowAction?.row.original ?? null}
      />
      <DeleteTasksDialog
        open={rowAction?.variant === 'delete'}
        onOpenChange={() => setRowAction(null)}
        tasks={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  )
}
