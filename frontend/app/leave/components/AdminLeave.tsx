"use client";


import { getAllLeaves } from "@/lib/sanity/utils/leaves";
import { Leave } from "@/types/leaves";
import {  useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getLeaveColumns } from "./LeaveColumns";
import Table from "@/app/_component/Table";
import Loading from "@/app/_component/Loading";



const TOTAL_LEAVE_DAYS = 20;

const COLORS = ["#8884d8", "#82ca9d"];

const AdminLeave = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [usedDays, setUsedDays] = useState(0);
  const [loading, setLoading] = useState(true);

  const colums = useMemo(
    () => getLeaveColumns({
      showActions: true,
      onApprove: (leaveId: string) => handleStatusChange(leaveId, "approved"),
      onReject: (leaveId: string) => handleStatusChange(leaveId, "rejected"),
    }),
    []
  );

  async function fetchLeaves() {
    setLoading(true);
    try {
    const response = await getAllLeaves();
    setLeaves(response);

    const approvedLeaves = response.filter(
      (leave) => leave.status === "approved"
    );
    const totalUsed = approvedLeaves.reduce(
      (acc, leave) => acc + (leave.days || 0),
      0
    );
    setUsedDays(totalUsed);
  }
  finally {
    setLoading(false);
  }
  }

  useEffect(() => {
    fetchLeaves();
  },[]);

  const handleStatusChange = async (
    leaveId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const response = await fetch(`/api/leaves/${leaveId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update leave status");

      alert(`Leave ${status} successfully!`);
      await fetchLeaves();
      if (status === "approved") {
        //  update employee Employement status to "on leave"
        const data = await response.json();
        // get employee id from response
        const employeeId = data.employee._id;
        const updateResponse = await fetch(`/api/employee/${employeeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employmentStatus: "on_leave" }),
        });
        if (!updateResponse.ok) {
          throw new Error("Failed to update employee status");
        }
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
      alert("Failed to update leave status.");
    }
  };

  const leaveBalanceData = [
    { name: "Used Leave", value: usedDays },
    {
      name: "Remaining Leave",
      value: Math.max(TOTAL_LEAVE_DAYS - usedDays, 0),
    },
  ];
  if (loading) {
    return <Loading/>
  }
  if( leaves.length === 0) {
    return <div className="text-center text-gray-500 py-4">
          No leave records found.
        </div>
  }
  return (
    <div className="text-black space-y-16 min-h-screen p-4 flex flex-col">
      <div>
        <h1 className="text-lg font-semibold mb-4">Leave Requests</h1>
        {/* Leave Table */}
        <Table
        columns={colums}
        data={leaves}
        />
        {leaves.length === 0 && (
          <p className="text-center text-gray-500">No leave requests found.</p>
        )}
      </div>

      {/* Pie Chart */}
      <div className="w-2/5 h-72">
        <h1 className=" text-lg font-semibold mb-4">
          Employee Leave Balance
        </h1>
        <ResponsiveContainer className="bg-white rounded-md shadow-md p-4">
          <PieChart>
            <Pie
              data={leaveBalanceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {leaveBalanceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fontSize={14}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminLeave;
