"use client";

import { calculateWorkHours } from "@/app/utils/utils";
import { Attendance } from "@/types/attendance";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

interface Props {
  attendances: Attendance[];
  enableFilters?: boolean;
}

export default function AttendanceTable({
  attendances,
  enableFilters = false,
}: Props) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo<ColumnDef<Attendance>[]>(
    () => [
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => info.getValue(),
        filterFn: "includesString",
      },
      {
        header: "Employee Name",
        accessorKey: "employee.name",
        cell: (info) => info.row.original.employee.name,
        filterFn: "includesString",
      },
      {
        header: "Department",
        accessorKey: "employee.department.name",
        cell: (info) =>
          typeof info.row.original.employee.department === "object"
            ? info.row.original.employee.department?.name || "-"
            : info.row.original.employee.department,
        filterFn: "includesString",
      },
      {
        header: "Check-In",
        accessorKey: "checkIn",
        cell: (info) => info.getValue() || "-",
      },
      {
        header: "Check-Out",
        accessorKey: "checkOut",
        cell: (info) => info.getValue() || "-",
      },
      {
        header: "Total Work Hours",
        id: "workHours",
        cell: (info) => {
          const a = info.row.original;
          return calculateWorkHours(
            a.checkIn ?? undefined,
            a.checkOut ?? undefined
          );
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => info.getValue(),
        filterFn: "includesString",
      },
    ],
    []
  );

  const table = useReactTable({
    data: attendances,
    columns,
    state: {
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-4 bg-white rounded shadow-md space-y-6">
      {enableFilters && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {table.getAllColumns().map((column) =>
            column.getCanFilter() ? (
              <div key={column.id}>
                <label className="text-xs text-gray-500">
                  {column.columnDef.header as string}
                </label>
                <input
                  type="text"
                  placeholder={`Filter ${column.id}`}
                  value={(column.getFilterValue() ?? "") as string}
                  onChange={(e) => column.setFilterValue(e.target.value)}
                  className="w-full border px-2 py-1 rounded text-sm"
                />
              </div>
            ) : null
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border px-2 py-1">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="text-center">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border px-2 py-1">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {table.getRowModel().rows.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No attendance records found.
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 text-sm">
        <div>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <button
            className="px-3 py-1 border rounded not-disabled:cursor-pointer  bg-blue-500 text-white disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className="px-3 py-1 border rounded not-disabled:cursor-pointer  bg-blue-500 text-white disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
