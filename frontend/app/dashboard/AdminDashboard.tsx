"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/component/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { getEmployees } from "@/lib/sanity/utils/employee";
import { useSession } from "next-auth/react";

interface AdminDashboardProps {
  session: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ session }) => {
  const [employeeStats, setEmployeeStats] = useState({
    total: 0,
    active: 0,
    wfh: 0,
    absent: 0,
  });

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

  useEffect(() => {
    async function fetchStats() {
      const employees = await getEmployees();
      const total = employees.length;
      const active = employees.filter(
        (e) => e.employmentStatus === "active"
      ).length;
      const wfh = employees.filter((e) => e.employmentStatus === "wfh").length;
      const absent = employees.filter(
        (e) => e.employmentStatus === "on leave"
      ).length;
      setEmployeeStats({ total, active, wfh, absent });
    }
    fetchStats();
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
        WFH: <strong>{employeeStats.wfh}</strong>
      </Card>
      <Card>
        Absent: <strong>{employeeStats.absent}</strong>
      </Card>

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

export default AdminDashboard;
