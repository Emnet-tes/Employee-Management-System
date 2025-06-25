import { calculateWorkHours } from "@/app/utils/utils";
import { Attendance } from "@/types/attendance";
import { ColumnDef } from "@tanstack/react-table";

export function getAttendanceColumns():ColumnDef<Attendance>[] {
    return [
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
        ];
    }