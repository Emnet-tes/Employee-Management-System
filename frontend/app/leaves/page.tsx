"use client";
import { Leave } from "@/types/leaves";
import React, { useEffect, useState } from "react";

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);

  // Fetch leaves on mount
  useEffect(() => {
    fetch("/api/leaves")
      .then((res) => res.json())
      .then(setLeaves);
  }, []);

  // Create a test leave
  async function handleCreate() {
    const res = await fetch("/api/leaves", {
      method: "POST",
      body: JSON.stringify({
        type: "Vacation",
        status: "Pending",
        employeeId: "4a94372b-cf18-409b-a3b9-7e9bba255fd1",
        startDate: "2025-06-15",
        endDate: "2025-06-18",
        reason: "Vacation",
      }),
    });
    const newLeave = await res.json();
    setLeaves([...leaves, newLeave]);
  }

  // Delete a leave
  async function handleDelete(id: string) {
    await fetch(`/api/leaves/${id}`, { method: "DELETE" });
    setLeaves(leaves.filter((leave) => leave._id !== id));
  }

  return (
    <div>
      <h1>Leaves</h1>
      <button
        onClick={handleCreate}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Create Test Leave
      </button>
      <ul>
        {leaves.map((leave) => (
          <li
            key={leave._id}
            className="border p-2 mb-2 flex justify-between items-center"
          >
            <span>
              {leave.employee?.name || "Unknown"}: {leave.startDate} to{" "}
              {leave.endDate} ({leave.reason})
            </span>
            <button
              onClick={() => handleDelete(leave._id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
