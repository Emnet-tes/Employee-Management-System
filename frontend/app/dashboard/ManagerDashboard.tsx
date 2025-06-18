"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/component/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getEmployees } from "@/lib/sanity/utils/employee";

interface AdminDashboardProps {
    session: any;
}

const ManagerDashboard : React.FC<AdminDashboardProps> = ({session}) => {
  const [employeeStats, setEmployeeStats] = useState({ total: 0, active: 0, onLeave: 0 });
  type Attendance = { name: string; Present: number; Absent: number; Off: number };
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const employees = await getEmployees();
      const total = employees.length;
      const active = employees.filter(emp => emp.employmentStatus === "active").length;
      const onLeave = employees.filter(emp => emp.employmentStatus === "on leave").length;

      setEmployeeStats({ total, active, onLeave });
    };

    const generateAttendanceData = () => {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const data = days.map(day => ({
        name: day,
        Present: Math.floor(Math.random() * 10),
        Absent: Math.floor(Math.random() * 5),
        Off: Math.floor(Math.random() * 3),
      }));
      setAttendanceData(data);
    };

    fetchStats();
    generateAttendanceData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      <Card className="col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        <CardContent>Total Team: <strong>{employeeStats.total}</strong></CardContent>
        <CardContent>Active: <strong>{employeeStats.active}</strong></CardContent>
        <CardContent>On Leave: <strong>{employeeStats.onLeave}</strong></CardContent>
      </Card>

      <Card className="col-span-2">
        <CardContent>
          <h2 className="text-lg font-bold mb-2">Team Attendance Overview</h2>
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
          <h2 className="text-lg font-bold mb-2">Quick Summary</h2>
          <ul className="space-y-1">
            <li>- Monitor leave requests</li>
            <li>- Review performance logs</li>
            <li>- Assist scheduling</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerDashboard;
