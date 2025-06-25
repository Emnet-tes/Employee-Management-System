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
import { getAllLeaves } from "@/lib/sanity/utils/leaves";
import Loading from "../_component/Loading";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { Leave } from "@/types/leaves";

interface AdminDashboardProps {
  session: any;
}

const ManagerDashboard: React.FC<AdminDashboardProps> = ({ session }) => {
  const [employeeStats, setEmployeeStats] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
  });
  const [leaveStats, setLeaveStats] = useState({ total: 0, pending: 0 });
  const [performanceStats, setPerformanceStats] = useState({
    total: 0,
    avgRating: 0,
  });
  const [reviews, setReviews] = useState<any[]>([]);

  type Attendance = {
    name: string;
    Present: number;
    Absent: number;
    Off: number;
  };
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [leaveData, setLeaveData] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [pieMode, setPieMode] = useState<"reason" | "status">("reason");
  const [pieData, setPieData] = useState<any[]>([]);
  const pieColors = [
    "#60a5fa",
    "#34d399",
    "#fbbf24",
    "#f87171",
    "#a3a3a3",
    "#6366f1",
    "#f472b6",
  ];

  useEffect(() => {
    const fetchStatsAndAttendance = async () => {
      const employees = await getEmployees();
      const manager = employees.find(
        (emp) => emp._id === session.user.employeeId
      );
      const team = employees.filter(
        (emp) =>
          emp.department?.name === manager?.department?.name &&
          emp.role.title !== "manager" &&
          emp.role.title !== "admin"
      );

      const total = team.length;
      const active = team.filter(
        (emp) => emp.employmentStatus === "active"
      ).length;
      const onLeave = team.filter(
        (emp) => emp.employmentStatus === "on leave"
      ).length;
      setEmployeeStats({ total, active, onLeave });

      try {
        const { getAttendances } = await import(
          "@/lib/sanity/utils/attendance"
        );
        const attendanceRecords = await getAttendances();
        const teamIds = team.map((emp) => emp._id);
        const filteredRecords = attendanceRecords.filter((rec) =>
          teamIds.includes(rec.employee._id)
        );
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const grouped = {} as Record<
          string,
          { Present: number; Absent: number; Off: number }
        >;
        for (const rec of filteredRecords) {
          const date = new Date(rec.date);
          const day = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
          if (!grouped[day]) grouped[day] = { Present: 0, Absent: 0, Off: 0 };
          if (rec.status === "Present") grouped[day].Present += 1;
          else if (rec.status === "Absent") grouped[day].Absent += 1;
          else grouped[day].Off += 1;
        }
        const data = days.map((day) => ({
          name: day,
          Present: grouped[day]?.Present || 0,
          Absent: grouped[day]?.Absent || 0,
          Off: grouped[day]?.Off || 0,
        }));
        setAttendanceData(data);

        const leaveData = await getAllLeaves();
        // Filter leaveData to only those in the manager's department
        const teamLeaves = leaveData.filter((l: any) =>
          teamIds.includes(l.employee?._id)
        );
        setLeaveData(teamLeaves);
        const pending = teamLeaves.filter(
          (l: any) => l.status === "pending"
        ).length;
        setLeaveStats({ total: teamLeaves.length, pending });

        const res = await fetch(
          `/api/performance?reviewerId=${session.user.employeeId}`
        );
        const teamPerformance = await res.json();
        const avgRating =
          teamPerformance.reduce(
            (sum: number, p: any) => sum + (p.rating || 0),
            0
          ) / (teamPerformance.length || 1);
        setPerformanceStats({ total: teamPerformance.length, avgRating });
      } catch (err) {
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStatsAndAttendance();
  }, []);

  useEffect(() => {
    // Pie chart data
    if (pieMode === "reason") {
      // Group by type (not reason)
      const typeCounts: Record<string, number> = {};
      leaveData.forEach((l: any) => {
        const type = l.type || "Other";
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
      setPieData(
        Object.entries(typeCounts).map(([name, value]) => ({ name, value }))
      );
    } else {
      // Group by status
      const statusCounts: Record<string, number> = {};
      leaveData.forEach((l: any) => {
        const status = l.status || "unknown";
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      setPieData(
        Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
      );
    }
  }, [leaveStats, pieMode]);

  if (loading) return <Loading />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 ">
      <Card className="shadow-lg transition-transform transform hover:scale-105">
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Total Team Members
          </h3>
          <strong className="text-2xl text-gray-900">
            {employeeStats.total}
          </strong>
        </div>
      </Card>
      <Card className="shadow-lg transition-transform transform hover:scale-103">
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Active Members
          </h3>
          <strong className="text-2xl text-gray-900">
            {employeeStats.active}
          </strong>
        </div>
      </Card>
      <Card className="shadow-lg transition-transform transform hover:scale-105">
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">On Leave</h3>
          <strong className="text-2xl text-gray-900">
            {employeeStats.onLeave}
          </strong>
        </div>
      </Card>

      <Card className="col-span-2 shadow-lg transition-transform transform hover:scale-105">
        <CardContent>
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            Team Attendance Overview
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceData}>
              <XAxis dataKey="name" tick={{ fill: "gray" }} />
              <YAxis tick={{ fill: "gray" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                }}
              />
              <Bar dataKey="Present" fill="#4ade80" />
              <Bar dataKey="Absent" fill="#f87171" />
              <Bar dataKey="Off" fill="#a3a3a3" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="flex-1 bg-white rounded-lg shadow p-6 flex flex-col transition-transform transform hover:scale-105 ">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
            Team Leave request  Overview
          </h2>
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              pieMode === "reason"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setPieMode("reason")}
          >
            By Reason
          </button>
          <button
            className={`px-4 py-2 rounded ${
              pieMode === "status"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setPieMode("status")}
          >
            By Status
          </button>
        </div>
        <div className="flex flex-col items-center" > 
        <PieChart width={320} height={320} >
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {pieData.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={pieColors[idx % pieColors.length]}
              />
            ))}
          </Pie>
          <Legend />
        </PieChart>
        </div>
      </div>

      <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-blue-50 p-6 rounded-xl shadow-md border border-blue-200 transition-transform transform hover:scale-105">
          <p className="text-blue-700 text-sm font-medium">
            Pending Leave Requests
          </p>
          <p className="text-blue-900 text-3xl font-bold">
            {leaveStats.pending}
          </p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-xl shadow-md border border-yellow-200 transition-transform transform hover:scale-105">
          <p className="text-yellow-700 text-sm font-medium">
            Total Leave Requests
          </p>
          <p className="text-yellow-900 text-3xl font-bold">
            {leaveStats.total}
          </p>
        </div>
        <div className="bg-green-50 p-6 rounded-xl shadow-md border border-green-200 transition-transform transform hover:scale-105">
          <p className="text-green-700 text-sm font-medium">
            Performance Reviews
          </p>
          <p className="text-green-900 text-3xl font-bold">
            {performanceStats.total}
          </p>
        </div>
        <div className="bg-purple-50 p-6 rounded-xl shadow-md border border-purple-200 transition-transform transform hover:scale-105">
          <p className="text-purple-700 text-sm font-medium">Average Rating</p>
          <p className="text-purple-900 text-3xl font-bold">
            {performanceStats.avgRating.toFixed(1)} / 5
          </p>
        </div>
        <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 transition-transform transform hover:scale-105">
          <p className="text-gray-700 text-sm font-medium">Scheduling Tools</p>
          <p className="text-gray-900 text-xl font-semibold">Active & Ready</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
