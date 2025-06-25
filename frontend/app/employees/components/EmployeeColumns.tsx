import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

import { Employee } from "@/types/employee";
import { buildImageUrl } from "@/app/utils/utils";

interface ColumnOptions {
  showActions: boolean;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employeeId: string, userId: string) => void;
}

export function getEmployeeColumns({
  showActions,
  onEdit,
  onDelete,
}: ColumnOptions): ColumnDef<Employee>[] {
  return [
    {
      header: "Photo",
      accessorKey: "photo",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <Image
            src={
              employee.photo?.asset?._ref
                ? buildImageUrl(employee.photo.asset._ref)
                : "/loginImage.png"
            }
            alt="photo"
            width={40}
            height={40}
            className="w-[60px] h-[60px] object-cover rounded-full"
          />
        );
      },
    },
    {
      header: "Name",
      accessorKey: "user.name",
      cell: (info) => (
        <div className="text-center">{String(info.getValue())}</div>
      ),
    },
    {
      header: "Email",
      accessorKey: "user.email",
      cell: (info) => (
        <div className="text-center">{String(info.getValue())}</div>
      ),
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (info) => (
        <div className="text-center">{String(info.getValue())}</div>
      ),
    },
    {
      header: "Role",
      accessorKey: "role.title",
      cell: (info) => (
        <div className="text-center">{String(info.getValue())}</div>
      ),
    },
    {
      header: "Department",
      accessorKey: "department.name",
      cell: (info) => (
        <div className="text-center">{String(info.getValue())}</div>
      ),
    },
    {
      header: "Status",
      accessorKey: "employmentStatus",
      cell: (info) => {
        const val = info.getValue();
        const color =
          val === "active"
            ? "text-green-600"
            : val === "terminated"
              ? "text-red-600"
              : "text-yellow-600";
        return (
          <span className={`font-medium ${color} text-center block`}>
            {val
              ? String(val).charAt(0).toUpperCase() + String(val).slice(1)
              : "N/A"}
          </span>
        );
      },
    },
    ...(showActions
      ? [
          {
            header: "Actions",
            id: "actions",
            cell: ({ row }: { row: import("@tanstack/react-table").Row<Employee> }) => {
              const emp = row.original;
              return (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit?.(emp)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete?.(emp._id, emp.user._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            },
          },
        ]
      : []),
  ];
}
