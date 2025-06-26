"use client";

import { useEffect, useState } from "react";
import { getAllLeaves } from "@/lib/sanity/utils/leaves";
import { Leave } from "@/types/leaves";
import Loading from "@/app/_component/Loading";
import LeaveTable from "./LeaveTable";
import LeaveBalanceChart from "./LeaveBalanceChart";

const TOTAL_LEAVE_DAYS = 20;

const AdminLeave = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [usedDays, setUsedDays] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const data = await getAllLeaves();
      setLeaves(data);

      const approved = data.filter((leave) => leave.status === "approved");
      const totalUsed = approved.reduce((acc, l) => acc + (l.days || 0), 0);
      setUsedDays(totalUsed);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    leaveId: string,
    status: "approved" | "rejected"
  ) => {
    const leave = leaves.find((l) => l._id === leaveId);
    try {
      const res = await fetch(`/api/leaves/${leaveId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      if (leave) {
        await fetch("/api/notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientId: leave.employee._id,
            type: "leave_status",
            message: `Your leave request has been ${status}`,
          }),
        });
      }

      alert(`Leave ${status} successfully!`);
      await fetchLeaves();

      if (status === "approved") {
        const updated = await res.json();
        await fetch(`/api/employee/${updated.employee._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employmentStatus: "on_leave" }),
        });
      }
    } catch (err) {
      console.error("Failed to update leave:", err);
      alert("Could not update leave.");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  if (loading) return <Loading />;

  if (leaves.length === 0)
    return <div className="text-center text-gray-500 py-4">No leave data.</div>;

  return (
    <div className="text-black space-y-16 min-h-screen p-4 flex flex-col">
      <LeaveTable
        leaves={leaves}
        onApprove={(id) => handleStatusChange(id, "approved")}
        onReject={(id) => handleStatusChange(id, "rejected")}
      />
      <LeaveBalanceChart usedDays={usedDays} totalDays={TOTAL_LEAVE_DAYS} />
    </div>
  );
};

export default AdminLeave;
