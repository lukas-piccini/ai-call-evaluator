import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import Skeleton from "react-loading-skeleton"

import { columns } from "./Columns"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Call } from "@/types/call"

export function CallTable({ isLoading, data }: { isLoading: boolean, data: Call.CallResponse[] }) {
  // eslint-disable-next-line
  const [globalFilter, setGlobalFilter] = useState<any>([])
  const finalData = useMemo(() => {
    return isLoading ? Array(10).fill({}) : data
  }, [isLoading, data])

  const finalColumns = useMemo(() => {
    return isLoading ? columns.map(column => ({
      ...column,
      cell: () => {
        return (
          <Skeleton />
        )
      }
    })) : columns
  }, [isLoading])

  const table = useReactTable({
    data: finalData,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter
    }
  })

  return (
    <div className="flex flex-col flex-1 basis-auto gap-2 overflow-auto">
      <div className="sm:flex sm:justify-between">
        <div>
          <p className="text-2xl font-bold">Call History</p>
          <p className="text-sm italic">A list of all recent calls</p>
        </div>
        <div className="sm:flex md:items-end">
          <Input
            placeholder="Search calls"
            value={globalFilter}
            onChange={(event) =>
              table.setGlobalFilter(String(event.target.value))
            }
            className="max-w-sm"
          />
        </div>
      </div>
      <div className="bg-card shadow-sm rounded-md border ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <p className="text-sm">Page {(table.options.state.pagination?.pageIndex || 0) + 1} / {table.getPageCount()}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
