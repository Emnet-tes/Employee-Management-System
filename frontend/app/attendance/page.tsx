"use client";

import {
  getAttendances,
  createAttendance,
  deleteAttendance,
} from "@/lib/sanity/utils/attendance";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [attendances, setAttendances] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getAttendances();
      setAttendances(data);
    }
    fetchData();
  }, []);

  async function handleCreate() {
    const res = await fetch("/api/attendance", {
      method: "POST",
      body: JSON.stringify({
        employeeId: "4a94372b-cf18-409b-a3b9-7e9bba255fd1",
        date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
        checkIn: "2025-06-12 09:00",
        checkOut: "2025-06-12 17:00",
      }),
    });
    const newAttendance = await res.json();
    setAttendances([...attendances, newAttendance]);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/attendance/${id}`, { method: "DELETE" });
    setAttendances(attendances.filter((att) => att._id !== id));
  }

  return (
    <div>
      <button
        onClick={handleCreate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create Test Attendance
      </button>
      {attendances.map((attendance) => (
        <div key={attendance._id} className="border p-4 my-2">
          <h2>{attendance.employee.name}</h2>
          <p>Date: {new Date(attendance.date).toLocaleDateString()}</p>
          <p>Check In: {attendance.checkIn}</p>
          <p>Check Out: {attendance.checkOut}</p>
          <p>Created At: {attendance._createdAt}</p>
          <button
            onClick={() => handleDelete(attendance._id)}
            className="text-red-600 mt-2"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Page;
