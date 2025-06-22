import { Leave } from "@/types/leaves";
import { ColumnDef } from "@tanstack/react-table";

interface ColumnOptions {
  showActions?: boolean;
  onApprove?: (leaveId: string) => void;
  onReject?: (leaveId: string) => void;
}

export function getLeaveColumns({
    showActions,
    onApprove,
    onReject,
}: ColumnOptions): ColumnDef<Leave>[] {
    return  [
        {
          header: "Name",
          accessorKey: "employee.name",
          cell: (info) => (
            <div className="text-center">{String(info.getValue())}</div>
          ),
        },
        {
          header: "From Date",
          accessorKey: "startDate",
          cell: (info) => (
            <div className="text-center">{String(info.getValue())}</div>
          ),
        },
        {
          header: "To Date",
          accessorKey: "endDate",
          cell: (info) => (
            <div className="text-center">{String(info.getValue())}</div>
          ),
        },
        {
          header: "No. of Days",
          accessorKey: "days",
          cell: (info) => {
            const start = new Date(info.row.original.startDate);
            const end = new Date(info.row.original.endDate);
            const diff =
              Math.ceil(
                (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
              ) + 1;
            return <div className="text-center">{diff}</div>;
          },
        },
        {
          header: "Leave Type",
          accessorKey: "type",
          cell: (info) => (
            <div className="text-center">{String(info.getValue())}</div>
          ),
        },
        {
          header: "Reason",
          accessorKey: "reason",
          cell: (info) => (
            <div className="text-center">{String(info.getValue())}</div>
          ),
        },
        {
          header: "Status",
          accessorKey: "status",
          cell: (info) => {
            const status = info.getValue();
            const color =
              status === "approved"
                ? "text-green-600"
                : status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600";
            return (
              <div className={`text-center font-bold ${color}`}>
                {String(status)}
              </div>
            );
          },
        },
        ...(showActions
          ? [
              {
                id: "actions",
                header: "Actions",
                cell: ({ row }: { row: { original: Leave } }) => (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onApprove?.(row.original._id)}
                      className="px-2 py-1 not-disabled:cursor-pointer bg-green-500 disabled:bg-green-500/50 text-white rounded text-sm"
                      disabled={row.original.status !== "pending"}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onReject?.(row.original._id)}
                      className="px-2 py-1 not-disabled:cursor-pointer bg-red-500 disabled:bg-red-500/50 text-white rounded text-sm"
                      disabled={row.original.status !== "pending"}
                    >
                      Reject
                    </button>
                  </div>
                ),
              },
            ]
          : []),
      ];
    }
