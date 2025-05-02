'use client'

import * as React from 'react'
import { ArrowUp, CheckCircle2, Download, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'

import { tasksApi } from '../tasks-api'

import type { Table } from '@tanstack/react-table'

import type { Task } from '@/db/schema'

import { tasks } from '@/db/schema'

import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from '@/components/data-table/data-table-action-bar'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { exportTableToCSV } from '@/lib/export'

const actions = [
  'update-status',
  'update-priority',
  'export',
  'delete',
] as const

type Action = (typeof actions)[number]

interface TasksTableActionBarProps {
  table: Table<Task>
}

export function TasksTableActionBar({ table }: TasksTableActionBarProps) {
  const router = useRouter()
  const rows = table.getFilteredSelectedRowModel().rows
  const [isPending, startTransition] = React.useTransition()
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null)

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  )

  const onTaskUpdate = React.useCallback(
    ({
      field,
      value,
    }: {
      field: 'status' | 'priority'
      value: Task['status'] | Task['priority']
    }) => {
      setCurrentAction(field === 'status' ? 'update-status' : 'update-priority')
      startTransition(async () => {
        const { error } = await tasksApi.updateMany({
          data: {
            ids: rows.map((row) => row.original.id),
            [field]: value,
          },
        })

        if (error) {
          toast.error(error)
          return
        }
        toast.success('Tasks updated')
        router.invalidate()
      })
    },
    [rows],
  )

  const onTaskExport = React.useCallback(() => {
    setCurrentAction('export')
    startTransition(() => {
      exportTableToCSV(table, {
        excludeColumns: ['select', 'actions'],
        onlySelected: true,
      })
    })
  }, [table])

  const onTaskDelete = React.useCallback(() => {
    setCurrentAction('delete')
    startTransition(async () => {
      const { error } = await tasksApi.deleteMany({
        data: {
          ids: rows.map((row) => row.original.id),
        },
      })

      if (error) {
        toast.error(error)
        return
      }
      toast.success('Tasks deleted')
      router.invalidate()
      table.toggleAllRowsSelected(false)
    })
  }, [rows, table])

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        <Select
          onValueChange={(value: Task['status']) =>
            onTaskUpdate({ field: 'status', value })
          }
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update status"
              isPending={getIsActionPending('update-status')}
            >
              <CheckCircle2 />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {tasks.status.enumValues.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value: Task['priority']) =>
            onTaskUpdate({ field: 'priority', value })
          }
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update priority"
              isPending={getIsActionPending('update-priority')}
            >
              <ArrowUp />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {tasks.priority.enumValues.map((priority) => (
                <SelectItem
                  key={priority}
                  value={priority}
                  className="capitalize"
                >
                  {priority}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DataTableActionBarAction
          size="icon"
          tooltip="Export tasks"
          isPending={getIsActionPending('export')}
          onClick={onTaskExport}
        >
          <Download />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete tasks"
          isPending={getIsActionPending('delete')}
          onClick={onTaskDelete}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  )
}
