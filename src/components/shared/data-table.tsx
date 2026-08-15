"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"
import { cn } from "@/libs/utils"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  globalFilter?: string
  isPaginated?: boolean
  setGlobalFilter?: (value: string) => void
  pageSize?: number
  onRowClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  globalFilter = "",
  isPaginated = true,
  setGlobalFilter,
  pageSize = 6,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  // Calculate items ranges for pagination text label
  const pageIndex = table.getState().pagination.pageIndex
  const currentPageSize = table.getState().pagination.pageSize
  const totalRows = table.getFilteredRowModel().rows.length
  const startRow = totalRows === 0 ? 0 : pageIndex * currentPageSize + 1
  const endRow = Math.min((pageIndex + 1) * currentPageSize, totalRows)

  return (
    <div className="space-y-6">
      {/* Table Grid */}
      <div className="border border-zinc-200/60 rounded-[8px] overflow-hidden shadow-2xs bg-white">
        <Table>
          <TableHeader className="bg-secondary-color border-b-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-b-0"
              >
                {headerGroup.headers.map((header) => {
                  // Retrieve meta alignment if specified, default to left
                  const meta = header.column.columnDef.meta as { align?: "left" | "center" | "right" } | undefined
                  const alignment = meta?.align || "left"

                  return (
                    <TableHead
                      key={header.id}
                      className="text-white font-dm-san-regular font-bold text-base py-4 tracking-wider first:pl-6 last:pr-6 select-none"
                      style={{ textAlign: alignment }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(
                    "hover:bg-zinc-50/50 border-b text-[#2B2B2B] border-zinc-100 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as { align?: "left" | "center" | "right" } | undefined
                    const alignment = meta?.align || "left"

                    return (
                      <TableCell
                        key={cell.id}
                        className="py-6 first:pl-6 last:pr-6 align-middle"
                        style={{ textAlign: alignment }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-body-text opacity-60 font-sans"
                >
                  No items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {isPaginated && totalRows > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mt-4">
          {/* Item counts */}
          <span className="text-sm font-sans text-body-text opacity-70">
            Showing {startRow} to {endRow} of {totalRows}
          </span>

          {/* Controls */}
          <div className="flex items-center gap-1.5">
            {/* Previous button */}
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="size-8.5 flex items-center justify-center rounded-full border border-zinc-300 bg-white text-body-text hover:bg-zinc-50 transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none outline-hidden"
            >
              <IconChevronLeft className="size-4.5" />
            </button>

            {/* Page number buttons */}
            {Array.from({ length: table.getPageCount() }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => table.setPageIndex(idx)}
                className={`size-8.5 flex items-center justify-center rounded-full text-xs font-bold font-sans cursor-pointer transition-colors outline-hidden ${pageIndex === idx
                  ? "bg-[#4f73b8] text-white"
                  : "text-body-text border border-transparent hover:bg-zinc-100"
                  }`}
              >
                {idx + 1}
              </button>
            ))}

            {/* Next button */}
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="size-8.5 flex items-center justify-center rounded-full border border-zinc-300 bg-white text-body-text hover:bg-zinc-50 transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none outline-hidden"
            >
              <IconChevronRight className="size-4.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
