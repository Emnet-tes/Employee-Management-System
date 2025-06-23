"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/component/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getEmployees } from "@/lib/sanity/utils/employee";
import { getAttendances } from "@/lib/sanity/utils/attendance";

interface AdminDashboardProps {
  session: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ session }) => {
  const [employeeStats, setEmployeeStats] = useState({
    total: 0,
    active: 0,
    terminated: 0,
    onLeave: 0,
  });
  const [attendanceData, setAttendanceData] = useState<any[]>([]);

  const leaveSummary = {
    available: 8,
    taken: 16,
    annual: 24,
  };

  useEffect(() => {
    async function fetchStats() {
      const employees = await getEmployees();
      const total = employees.length;
      const active = employees.filter(
        (e) => e.employmentStatus === "active"
      ).length;
      const terminated = employees.filter(
        (e) => e.employmentStatus === "Terminated"
      ).length;
      const onLeave = employees.filter(
        (e) => e.employmentStatus === "on leave"
      ).length;
      setEmployeeStats({ total, active, terminated, onLeave });
    }
    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const records = await getAttendances();
        console.log("Attendance Records:", records);
        // Group by day of week and status
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const grouped: Record<
          string,
          { Present: number; Absent: number; "on leave": number }
        > = {};
        for (const rec of records) {
          const date = new Date(rec.date);
          const day = days[date.getDay()];
          if (!grouped[day])
            grouped[day] = { Present: 0, Absent: 0, "on leave": 0 };
          grouped[day][rec.status as "Present" | "Absent" | "on leave"] =
            (grouped[day][rec.status as "Present" | "Absent" | "on leave"] ||
              0) + 1;
        }
        // Fill missing days for chart consistency
        const chartData = days.map((day) => ({
          name: day,
          Present: grouped[day]?.Present || 0,
          Absent: grouped[day]?.Absent || 0,
          "on leave": grouped[day]?.["on leave"] || 0,
        }));
        setAttendanceData(chartData);
      } catch (err) {
        setAttendanceData([]);
      }
    }
    fetchAttendance();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      <Card>
        Clock In: <strong>9:30 AM</strong>
      </Card>
      <Card>
        Clock Out: <strong>9:30 PM</strong>
      </Card>
      <Card>
        Total Employee: <strong>{employeeStats.total}</strong>
      </Card>
      <Card>
        Active: <strong>{employeeStats.active}</strong>
      </Card>
      <Card>
        Terminated: <strong>{employeeStats.terminated}</strong>
      </Card>
      <Card>
        On Leave: <strong>{employeeStats.onLeave}</strong>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-lg font-bold mb-2 text-black">
            Attendance Performances
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData}>
              <XAxis dataKey="name" tick={{ fill: "black" }} />
              <YAxis tick={{ fill: "black" }} />
              <Tooltip contentStyle={{ color: "black" }} />
              <Bar dataKey="Present" fill="#4ade80" />
              <Bar dataKey="Absent" fill="#f87171" />
              <Bar dataKey="on leave" fill="#a3a3a3" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-lg font-bold mb-2 text-black">Leave Summary</h2>
          <ul className="text-black">
            <li>Available: {leaveSummary.available}</li>
            <li>Taken: {leaveSummary.taken}</li>
            <li>Annual: {leaveSummary.annual}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
