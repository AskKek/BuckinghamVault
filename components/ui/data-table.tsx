"use client"

/**
 * Enterprise DataTable Component
 * Sophisticated table component for institutional financial data display
 */

import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  Search,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { getThemeClasses, THEME_ANIMATIONS } from '@/lib/theme'

// Core table interfaces
export interface TableColumn<T = any> {
  id: string
  header: string
  accessorKey?: keyof T
  accessor?: (row: T) => any
  cell?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  align?: 'left' | 'center' | 'right'
  sticky?: boolean
  hidden?: boolean
  meta?: {
    type?: 'text' | 'number' | 'currency' | 'date' | 'status' | 'custom'
    format?: string
    precision?: number
    currency?: string
  }
}

export interface TablePagination {
  pageIndex: number
  pageSize: number
  total: number
  pageSizeOptions?: number[]
}

export interface TableSorting {
  column: string
  direction: 'asc' | 'desc'
}

export interface TableFiltering {
  column: string
  value: any
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'between'
}

export interface DataTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  pagination?: TablePagination
  sorting?: TableSorting[]
  filtering?: TableFiltering[]
  selection?: {
    enabled: boolean
    selectedRows: string[]
    onSelectionChange: (selectedRows: string[]) => void
    getRowId: (row: T) => string
  }
  onSortingChange?: (sorting: TableSorting[]) => void
  onFilteringChange?: (filtering: TableFiltering[]) => void
  onPaginationChange?: (pagination: Partial<TablePagination>) => void
  onRowClick?: (row: T) => void
  onExport?: () => void
  emptyMessage?: string
  className?: string
  variant?: 'default' | 'compact' | 'comfortable'
  showHeader?: boolean
  showFooter?: boolean
  showToolbar?: boolean
  stickyHeader?: boolean
  virtualized?: boolean
  maxHeight?: string
}

function DataTableToolbar<T>({
  columns,
  onColumnsChange,
  onExport,
  searchValue,
  onSearchChange,
  className
}: {
  columns: TableColumn<T>[]
  onColumnsChange?: (columns: TableColumn<T>[]) => void
  onExport?: () => void
  searchValue: string
  onSearchChange: (value: string) => void
  className?: string
}) {
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    columns.reduce((acc, col) => ({ ...acc, [col.id]: !col.hidden }), {})
  )

  const handleColumnVisibilityChange = useCallback((columnId: string, visible: boolean) => {
    const newVisibility = { ...columnVisibility, [columnId]: visible }
    setColumnVisibility(newVisibility)
    
    if (onColumnsChange) {
      const updatedColumns = columns.map(col => ({
        ...col,
        hidden: !newVisibility[col.id]
      }))
      onColumnsChange(updatedColumns)
    }
  }, [columnVisibility, columns, onColumnsChange])

  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-gold/20 bg-navy-800/40",
      className
    )}>
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
          <Input
            placeholder="Search table..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full sm:w-64 bg-navy-900/60 border-gold/20 text-white placeholder:text-white/50 focus:border-gold"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {/* Column Visibility */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <Eye className="w-4 h-4 mr-2" />
              Columns
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-navy-900/95 border-gold/20" align="end">
            <div className="space-y-2">
              <h4 className="font-medium text-white text-sm">Toggle Columns</h4>
              {columns.map((column) => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.id}
                    checked={columnVisibility[column.id]}
                    onCheckedChange={(checked) => 
                      handleColumnVisibilityChange(column.id, checked as boolean)
                    }
                    className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                  />
                  <label
                    htmlFor={column.id}
                    className="text-sm text-white cursor-pointer flex-1"
                  >
                    {column.header}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Export */}
        {onExport && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        )}
      </div>
    </div>
  )
}

function TablePaginationControls({ 
  pagination, 
  onPaginationChange 
}: {
  pagination: TablePagination
  onPaginationChange: (pagination: Partial<TablePagination>) => void
}) {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize)
  const currentPage = pagination.pageIndex + 1

  const pageSizeOptions = pagination.pageSizeOptions || [10, 25, 50, 100]

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 py-3 border-t border-gold/20 bg-navy-800/40">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-sm text-white/70">
        <span>
          Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
          {Math.min((pagination.pageIndex + 1) * pagination.pageSize, pagination.total)} of{' '}
          {pagination.total} results
        </span>
        
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pagination.pageSize}
            onChange={(e) => onPaginationChange({ 
              pageSize: Number(e.target.value), 
              pageIndex: 0 
            })}
            className="bg-navy-900/60 border border-gold/20 text-white rounded px-2 py-1 text-sm focus:border-gold focus:outline-none"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPaginationChange({ pageIndex: 0 })}
          disabled={pagination.pageIndex === 0}
          className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-50"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPaginationChange({ pageIndex: pagination.pageIndex - 1 })}
          disabled={pagination.pageIndex === 0}
          className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-1 mx-2">
          <span className="text-sm text-white/70">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPaginationChange({ pageIndex: pagination.pageIndex + 1 })}
          disabled={pagination.pageIndex >= totalPages - 1}
          className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPaginationChange({ pageIndex: totalPages - 1 })}
          disabled={pagination.pageIndex >= totalPages - 1}
          className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-50"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export function DataTable<T>({
  data,
  columns: initialColumns,
  loading = false,
  pagination,
  sorting = [],
  filtering = [],
  selection,
  onSortingChange,
  onFilteringChange,
  onPaginationChange,
  onRowClick,
  onExport,
  emptyMessage = "No data available",
  className,
  variant = 'default',
  showHeader = true,
  showFooter = true,
  showToolbar = true,
  stickyHeader = false,
  maxHeight = "600px"
}: DataTableProps<T>) {
  const [columns, setColumns] = useState(initialColumns)
  const [searchValue, setSearchValue] = useState('')

  // Filter visible columns
  const visibleColumns = useMemo(() => 
    columns.filter(col => !col.hidden), [columns]
  )

  // Apply local search if no external filtering
  const filteredData = useMemo(() => {
    if (!searchValue || filtering.length > 0) return data
    
    return data.filter(row => {
      return visibleColumns.some(column => {
        const value = column.accessorKey 
          ? row[column.accessorKey]
          : column.accessor?.(row)
        
        return String(value || '').toLowerCase().includes(searchValue.toLowerCase())
      })
    })
  }, [data, searchValue, filtering.length, visibleColumns])

  // Handle sorting
  const handleSort = useCallback((columnId: string) => {
    if (!onSortingChange) return

    const existingSort = sorting.find(s => s.column === columnId)
    let newSorting: TableSorting[]

    if (!existingSort) {
      newSorting = [{ column: columnId, direction: 'asc' }]
    } else if (existingSort.direction === 'asc') {
      newSorting = [{ column: columnId, direction: 'desc' }]
    } else {
      newSorting = sorting.filter(s => s.column !== columnId)
    }

    onSortingChange(newSorting)
  }, [sorting, onSortingChange])

  // Handle row selection
  const handleRowSelection = useCallback((rowId: string, selected: boolean) => {
    if (!selection) return

    const newSelection = selected
      ? [...selection.selectedRows, rowId]
      : selection.selectedRows.filter(id => id !== rowId)
    
    selection.onSelectionChange(newSelection)
  }, [selection])

  const handleSelectAll = useCallback((selected: boolean) => {
    if (!selection) return

    const newSelection = selected
      ? filteredData.map(row => selection.getRowId(row))
      : []
    
    selection.onSelectionChange(newSelection)
  }, [selection, filteredData])

  // Row variants
  const rowVariants = {
    default: "hover:bg-white/5 transition-colors duration-200",
    compact: "py-2 hover:bg-white/5 transition-colors duration-200", 
    comfortable: "py-4 hover:bg-white/5 transition-colors duration-200"
  }

  const allSelected = selection?.selectedRows.length === filteredData.length && filteredData.length > 0
  const someSelected = selection && selection.selectedRows.length > 0 && selection.selectedRows.length < filteredData.length

  return (
    <div className={cn(
      "rounded-lg border border-gold/20 bg-navy-800/60 backdrop-blur-lg overflow-hidden",
      "w-full", // Ensure container takes full width
      className
    )}>
      {/* Toolbar */}
      {showToolbar && (
        <DataTableToolbar
          columns={columns}
          onColumnsChange={setColumns}
          onExport={onExport}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
      )}

      {/* Table Container - Mobile Horizontal Scroll */}
      <div className="relative">
        {/* Mobile Scroll Indicator */}
        <div className="sm:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-navy-800/80 to-transparent pointer-events-none z-10" />
        <div 
          className="overflow-x-auto overflow-y-auto -webkit-overflow-scrolling-touch overscroll-behavior-x-auto scrollbar-thin scrollbar-track-navy/20 scrollbar-thumb-gold/30"
          style={{ maxHeight }}
        >
        <table className="w-full min-w-[640px]">
          {/* Header */}
          {showHeader && (
            <thead className={cn(
              "bg-navy-900/80",
              stickyHeader && "sticky top-0 z-10"
            )}>
              <tr className="border-b border-gold/20">
                {/* Selection Header */}
                {selection && (
                  <th className="w-12 p-3">
                    <Checkbox
                      checked={someSelected ? 'indeterminate' : allSelected}
                      onCheckedChange={handleSelectAll}
                      className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                    />
                  </th>
                )}

                {/* Column Headers */}
                {visibleColumns.map((column) => {
                  const sortInfo = sorting.find(s => s.column === column.id)
                  
                  return (
                    <th
                      key={column.id}
                      className={cn(
                        "p-3 text-left font-medium text-white/80 border-r border-gold/10 last:border-r-0 whitespace-nowrap",
                        column.align === 'center' && "text-center",
                        column.align === 'right' && "text-right",
                        column.sortable && "cursor-pointer hover:text-white touch-manipulation",
                        column.sticky && "sticky left-0 bg-navy-900/90"
                      )}
                      style={{ 
                        width: column.width,
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth
                      }}
                      onClick={() => column.sortable && handleSort(column.id)}
                    >
                      <div className="flex items-center gap-2">
                        {column.header}
                        {column.sortable && (
                          <div className="flex flex-col">
                            {!sortInfo && <ArrowUpDown className="w-3 h-3 text-white/40" />}
                            {sortInfo?.direction === 'asc' && <ArrowUp className="w-3 h-3 text-gold" />}
                            {sortInfo?.direction === 'desc' && <ArrowDown className="w-3 h-3 text-gold" />}
                          </div>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
          )}

          {/* Body */}
          <tbody>
            <AnimatePresence mode="popLayout">
              {loading ? (
                <tr>
                  <td colSpan={visibleColumns.length + (selection ? 1 : 0)} className="p-8 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold"></div>
                      <span className="text-white/60">Loading data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + (selection ? 1 : 0)} className="p-8 text-center">
                    <span className="text-white/60">{emptyMessage}</span>
                  </td>
                </tr>
              ) : (
                filteredData.map((row, rowIndex) => {
                  const rowId = selection?.getRowId(row) || String(rowIndex)
                  const isSelected = selection?.selectedRows.includes(rowId) || false

                  return (
                    <motion.tr
                      key={rowId}
                      {...THEME_ANIMATIONS.fadeIn}
                      className={cn(
                        "border-b border-gold/10 last:border-b-0",
                        rowVariants[variant],
                        isSelected && "bg-gold/10",
                        onRowClick && "cursor-pointer"
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {/* Selection Cell */}
                      {selection && (
                        <td className="w-12 p-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => 
                              handleRowSelection(rowId, checked as boolean)
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                          />
                        </td>
                      )}

                      {/* Data Cells */}
                      {visibleColumns.map((column) => {
                        const cellValue = column.accessorKey 
                          ? row[column.accessorKey]
                          : column.accessor?.(row)

                        const renderedCell = column.cell 
                          ? column.cell(cellValue, row)
                          : String(cellValue || '')

                        return (
                          <td
                            key={column.id}
                            className={cn(
                              "p-3 text-white border-r border-gold/5 last:border-r-0 whitespace-nowrap",
                              column.align === 'center' && "text-center",
                              column.align === 'right' && "text-right",
                              column.sticky && "sticky left-0 bg-navy-800/90"
                            )}
                            style={{ 
                              width: column.width,
                              minWidth: column.minWidth,
                              maxWidth: column.maxWidth
                            }}
                          >
                            {renderedCell}
                          </td>
                        )
                      })}
                    </motion.tr>
                  )
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
        </div>
      </div>

      {/* Footer with Pagination */}
      {showFooter && pagination && onPaginationChange && (
        <TablePaginationControls
          pagination={pagination}
          onPaginationChange={onPaginationChange}
        />
      )}
    </div>
  )
}