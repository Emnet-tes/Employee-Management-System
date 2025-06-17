"use client";

import { Card, CardContent } from "@/component/card";
import { attendanceData } from "@/constant";
import {
  getAttendances,
} from "@/lib/sanity/utils/attendance";

import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import LeaveSummery from "../_component/LeaveSummery";
import TimeCard from "../_component/TimeCard";

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
      <TimeCard />
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 p-2">
        {/* Attendance Performance Chart */}
        <Card className="border-none shadow-md">
          <CardContent>
            <h2 className="text-lg font-bold mb-2">Monthly Overview</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendanceData} width={730} height={250}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Present" fill="#4ade80" />
                <Bar dataKey="Absent" fill="gray" />
                <Bar dataKey="Holidays" fill="orange" />
                <Bar dataKey="Off" fill="red" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leave Summary */}
        <LeaveSummery />
      </div>
      <button
        onClick={handleCreate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create Test Attendance
      </button>
      {attendances.map((attendance) => (
        <div key={attendance._id} className="border p-4 my-2 text-black">
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
