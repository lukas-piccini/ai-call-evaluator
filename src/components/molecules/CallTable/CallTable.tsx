import {
  flexRender,
  getCoreRowModel,
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
import { useMemo } from "react"
import type Retell from "retell-sdk"

export function CallTable({ isLoading, data }: { isLoading: boolean, data: Retell.Call.CallResponse[] }) {
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
  })

  return (
    <div className="flex flex-col flex-1 basis-auto gap-2 overflow-auto">
      <div>
        <p className="text-2xl font-bold">Call History</p>
        <p className="text-sm italic">A list of all recent calls</p>
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
      </div>
    </div>
  )
}
