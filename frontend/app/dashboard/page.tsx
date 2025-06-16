'use client'
import React from "react";
import { Card, CardContent } from "@/component/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const employeeStats = {
  total: 20,
  active: 2,
  wfh: 2,
  absent: 2,
};

const attendanceData = [
  { name: "Mon", Present: 6, Absent: 2, Off: 0 },
  { name: "Tue", Present: 6, Absent: 2, Off: 0 },
  { name: "Wed", Present: 6, Absent: 2, Off: 0 },
  { name: "Thu", Present: 0, Absent: 0, Off: 8 },
  { name: "Fri", Present: 6, Absent: 2, Off: 0 },
  { name: "Sat", Present: 8, Absent: 0, Off: 0 },
  { name: "Sun", Present: 8, Absent: 0, Off: 0 },
];

const pieData = [
  { name: "P1", value: 5 },
  { name: "P2", value: 5 },
  { name: "P3", value: 5 },
  { name: "P4", value: 5 },
  { name: "P5", value: 5 },
];

const leaveSummary = {
  available: 8,
  taken: 16,
  annual: 24,
};

const DashboardPage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      {/* Summary Cards */}
      <Card className="col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        <CardContent>Clock In: <strong>9:30 AM</strong></CardContent>
        <CardContent>Clock Out: <strong>9:30 PM</strong></CardContent>
        <CardContent>My Team: <strong>{employeeStats.total}</strong></CardContent>
        <CardContent>Active: <strong>{employeeStats.active}</strong></CardContent>
        <CardContent>WFH: <strong>{employeeStats.wfh}</strong></CardContent>
        <CardContent>Absent: <strong>{employeeStats.absent}</strong></CardContent>
      </Card>

      {/* Attendance Performance Chart */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-bold mb-2">Attendance Performances</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Present" fill="#4ade80" />
              <Bar dataKey="Absent" fill="#f87171" />
              <Bar dataKey="Off" fill="#a3a3a3" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Current Projects Pie */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-bold mb-2">My Current Project</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#60a5fa", "#facc15", "#f87171", "#34d399", "#a78bfa"][index % 5]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Leave Summary */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-bold mb-2">Leave Summary</h2>
          <ul>
            <li>Available: {leaveSummary.available}</li>
            <li>Taken: {leaveSummary.taken}</li>
            <li>Annual: {leaveSummary.annual}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
