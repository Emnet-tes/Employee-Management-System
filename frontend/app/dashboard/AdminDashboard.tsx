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
import Loading from "../_component/Loading";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { Attendance } from "@/types/attendance";
import { Leave } from "@/types/leaves";

const AdminDashboard = () => {
  const [employeeStats, setEmployeeStats] = useState({
    total: 0,
    active: 0,
    terminated: 0,
    onLeave: 0,
  });
  const [attendanceData, setAttendanceData] = useState<
    { name: string; Present: number; Absent: number; "on leave": number }[]
  >([]);
  // const [loading, setLoading] = useState(true);
  const [leaveData, setLeaveData] = useState<Leave[]>([]);
  const [pieMode, setPieMode] = useState<"type" | "status">("type");
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [performanceStats, setPerformanceStats] = useState({
    total: 0,
    avgRating: 0,
  });
  const [leaveStats, setLeaveStats] = useState({ total: 0, pending: 0 });
  const [departmentStats, setDepartmentStats] = useState({
    totalDepartments: 0,
    totalManagers: 0,
  });
  const [attendanceLoaded, setAttendanceLoaded] = useState(false);
  const [leavesLoaded, setLeavesLoaded] = useState(false);
  const [performanceLoaded, setPerformanceLoaded] = useState(false);
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
      // Calculate total departments and managers
      const departmentSet = new Set(
        employees.map((e) => e.department?.name).filter(Boolean)
      );
      const totalDepartments = departmentSet.size;
      const totalManagers = employees.filter(
        (e) => e.role?.title === "manager"
      ).length;
      setEmployeeStats({ total, active, terminated, onLeave });
      setDepartmentStats({ totalDepartments, totalManagers });
    }
    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const records: Attendance[] = await getAttendances();
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
      } catch {
        setAttendanceData([]);
      } finally {
        setAttendanceLoaded(true);
      }
    }
    fetchAttendance();
  }, []);

  useEffect(() => {
    async function fetchLeaves() {
      const res = await fetch("/api/leaves");
      const data: Leave[] = await res.json();
      setLeaveData(Array.isArray(data) ? data : []);
      setLeavesLoaded(true);
    }
    fetchLeaves();
  }, []);

  useEffect(() => {
    if (pieMode === "type") {
      const typeCounts: Record<string, number> = {};
      leaveData.forEach((l: Leave) => {
        const type = l.type || "Other";
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
      setPieData(
        Object.entries(typeCounts).map(([name, value]) => ({ name, value }))
      );
    } else {
      const statusCounts: Record<string, number> = {};
      leaveData.forEach((l: Leave) => {
        const status = l.status || "unknown";
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      setPieData(
        Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
      );
    }
  }, [leaveData, pieMode]);

  useEffect(() => {
    async function fetchPerformance() {
      try {
        const res = await fetch("/api/performance");
        const data: { rating?: number }[] = await res.json();
        const total = data.length;
        const avgRating =
          data.reduce((sum: number, p) => sum + (p.rating || 0), 0) /
          (total || 1);
        setPerformanceStats({ total, avgRating });
      } catch {
        setPerformanceStats({ total: 0, avgRating: 0 });
      } finally {
        setPerformanceLoaded(true);
      }
    }
    fetchPerformance();
  }, []);

  useEffect(() => {
    if (!leaveData || leaveData.length === 0) {
      setLeaveStats({ total: 0, pending: 0 });
      return;
    }
    const total = leaveData.length;
    const pending = leaveData.filter(
      (l: Leave) => l.status === "pending"
    ).length;
    setLeaveStats({ total, pending });
  }, [leaveData]);

  const allLoaded = attendanceLoaded && leavesLoaded && performanceLoaded;
  if (!allLoaded) return <Loading />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 ">
      <Card className="shadow-lg transition-transform transform hover:scale-105">
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Total Employees
          </h3>
          <strong className="text-2xl text-gray-900">
            {employeeStats.total}
          </strong>
        </div>
      </Card>
      <Card className="shadow-lg transition-transform transform hover:scale-105">
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Active Employees
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
      <Card className="shadow-lg transition-transform transform hover:scale-105">
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Total Departments
          </h3>
          <strong className="text-2xl text-gray-900">
            {departmentStats.totalDepartments}
          </strong>
        </div>
      </Card>
      <Card className="shadow-lg transition-transform transform hover:scale-105">
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Total Managers
          </h3>
          <strong className="text-2xl text-gray-900">
            {departmentStats.totalManagers}
          </strong>
        </div>
      </Card>

      <Card className="col-span-2 shadow-lg transition-transform transform hover:scale-103">
        <CardContent>
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            Attendance Performances
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
              <Bar dataKey="on leave" fill="#a3a3a3" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className=" flex-1 bg-white rounded-lg shadow p-6 flex flex-col  transform hover:scale-105 transition-transform">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          Employees Leave request Overview
        </h2>
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              pieMode === "type"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setPieMode("type")}
          >
            By Type
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
        <PieChart
          width={320}
          height={320}
          className="flex flex-col items-center"
        >
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

export default AdminDashboard;
