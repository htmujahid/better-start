'use client'

import {
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useNavigate } from '@tanstack/react-router'
import * as React from 'react'
import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  TableOptions,
  TableState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table'

export interface DataTableSearchParams {
  page: number
  perPage: number
  sort?: Array<{ id: string; desc: boolean }>
  [key: string]: unknown
}

interface UseDataTableProps<TData>
  extends
    Omit<
      TableOptions<TData>,
      | 'state'
      | 'pageCount'
      | 'getCoreRowModel'
      | 'manualFiltering'
      | 'manualPagination'
      | 'manualSorting'
    >,
    Required<Pick<TableOptions<TData>, 'pageCount'>> {
  /**
   * Current search params from the route (via Route.useSearch())
   */
  search: DataTableSearchParams
  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    sorting?: SortingState
  }
  /**
   * Filter columns that map to URL search params
   * Key is the column id, value is the search param key
   */
  filterColumns?: Record<string, string>
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    columns,
    pageCount = -1,
    search,
    initialState,
    filterColumns = {},
    ...tableProps
  } = props

  const navigate = useNavigate()

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {})

  // Derive pagination state from URL search params
  const pagination: PaginationState = React.useMemo(
    () => ({
      pageIndex: (search.page ?? 1) - 1,
      pageSize: search.perPage ?? 10,
    }),
    [search.page, search.perPage],
  )

  // Derive sorting state from URL search params
  const sorting: SortingState = React.useMemo(
    () => search.sort ?? [],
    [search.sort],
  )

  // Derive column filters from URL search params
  const columnFilters: ColumnFiltersState = React.useMemo(() => {
    const filters: ColumnFiltersState = []
    for (const [columnId, searchKey] of Object.entries(filterColumns)) {
      const value = search[searchKey]
      if (value !== undefined && value !== '' && value !== null) {
        filters.push({ id: columnId, value })
      }
    }
    return filters
  }, [search, filterColumns])

  // Handle pagination changes - update URL
  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      const newPagination =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(pagination)
          : updaterOrValue

      const newSearch = {
        ...search,
        page: newPagination.pageIndex + 1,
        perPage: newPagination.pageSize,
      }

      void navigate({
        to: '.',
        search: newSearch as Record<string, unknown>,
        replace: true,
      })
    },
    [pagination, navigate, search],
  )

  // Handle sorting changes - update URL
  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      const newSorting =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(sorting)
          : updaterOrValue

      const newSearch = {
        ...search,
        sort: newSorting.length > 0 ? newSorting : undefined,
        page: 1, // Reset to first page on sort change
      }

      void navigate({
        to: '.',
        search: newSearch as Record<string, unknown>,
        replace: true,
      })
    },
    [sorting, navigate, search],
  )

  // Handle column filter changes - update URL
  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      const newFilters =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(columnFilters)
          : updaterOrValue

      // Build the search params update from column filters
      const filterUpdates: Record<string, string | undefined> = {}

      // First, clear all filter columns
      for (const searchKey of Object.values(filterColumns)) {
        filterUpdates[searchKey] = undefined
      }

      // Then, set the new filter values
      for (const filter of newFilters) {
        const searchKey = filterColumns[filter.id]
        if (searchKey) {
          filterUpdates[searchKey] = filter.value as string
        }
      }

      const newSearch = {
        ...search,
        ...filterUpdates,
        page: 1, // Reset to first page on filter change
      }

      void navigate({
        to: '.',
        search: newSearch as Record<string, unknown>,
        replace: true,
      })
    },
    [columnFilters, filterColumns, navigate, search],
  )

  const table = useReactTable({
    ...tableProps,
    columns,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  return { table }
}
