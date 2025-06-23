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

interface AdminDashboardProps {
  session: any;
}

const ManagerDashboard: React.FC<AdminDashboardProps> = ({ session }) => {
  const [employeeStats, setEmployeeStats] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
  });
  type Attendance = {
    name: string;
    Present: number;
    Absent: number;
    Off: number;
  };
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);

  useEffect(() => {
    const fetchStatsAndAttendance = async () => {
      const employees = await getEmployees();
      // Find the manager
      const manager = employees.find(
        (emp) => emp._id === session.user.employeeId
      );
      // Filter employees in the same department as the manager (excluding manager and admins)
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

      // Fetch attendance data for only the team
      try {
        const { getAttendances } = await import(
          "@/lib/sanity/utils/attendance"
        );
        const records = await getAttendances();
        // Only include attendance for team members
        const teamIds = team.map((emp) => emp._id);
        const filteredRecords = records.filter((rec) =>
          teamIds.includes(rec.employee._id)
        );
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const grouped = {} as Record<
          string,
          { Present: number; Absent: number; Off: number }
        >;
        for (const rec of filteredRecords) {
          const date = new Date(rec.date);
          const day = days[date.getDay() === 0 ? 6 : date.getDay() - 1]; // JS: 0=Sun, chart: 0=Mon
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
      } catch (err) {
        setAttendanceData([]);
      }
    };
    fetchStatsAndAttendance();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      <Card>
        Total Team Member: <strong>{employeeStats.total}</strong>
      </Card>
      <Card>
        Active: <strong>{employeeStats.active}</strong>
      </Card>
      <Card>
        On Leave: <strong>{employeeStats.onLeave}</strong>
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
