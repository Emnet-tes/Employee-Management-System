"use client";
import Table from "@/app/_component/Table";
import { Leave } from "@/types/leaves";
import { getLeaveColumns } from "./LeaveColumns";

interface LeaveTableProps {
  leaves: Leave[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const LeaveTable = ({ leaves, onApprove, onReject }: LeaveTableProps) => {
  const columns = getLeaveColumns({
    showActions: true,
    onApprove,
    onReject,
  });

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Leave Requests</h1>
      <Table columns={columns} data={leaves} />
      {leaves.length === 0 && (
        <p className="text-center text-gray-500">No leave requests found.</p>
      )}
    </div>
  );
};

export default LeaveTable;
