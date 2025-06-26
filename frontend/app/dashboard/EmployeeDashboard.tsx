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
import { getAttendancesByEmployeeId } from "@/lib/sanity/utils/attendance";
import Loading from "../_component/Loading";

const leaveSummary = {
  available: 4,
  taken: 2,
  annual: 6,
};

interface Props {
  session: {
    user: {
      employeeId: string;
    };
  };
}

interface AttendanceChartData {
  name: string;
  Present: number;
  Absent: number;
  Off: number;
}

const EmployeeDashboard: React.FC<Props> = ({ session }) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceChartData[]>(
    []
  );
  const [performance, setPerformance] = useState<{
    date: string;
    rating: number;
    feedback: string;
    reviewer?: { name?: string };
  } | null>(null);
  const [attendanceLoaded, setAttendanceLoaded] = useState(false);
  const [performanceLoaded, setPerformanceLoaded] = useState(false);

  useEffect(() => {
    async function fetchPerformance() {
      if (!session?.user?.employeeId) {
        setPerformanceLoaded(true);
        return;
      }
      const res = await fetch(
        `/api/performance?employeeId=${session.user.employeeId}`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Sort by date descending and pick the latest
        const latest = data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
        setPerformance({
          date: latest.date,
          rating: latest.rating,
          feedback: latest.feedback,
          reviewer: latest.reviewer,
        });
      } else {
        setPerformance(null);
      }
      setPerformanceLoaded(true);
    }
    fetchPerformance();
  }, [session]);

  useEffect(() => {
    async function fetchAttendance() {
      if (!session?.user?.employeeId) {
        setAttendanceLoaded(true);
        return;
      }
      const records = await getAttendancesByEmployeeId(session.user.employeeId);
      // Filter records to only those from the previous week
      const now = new Date();
      const startOfThisWeek = new Date(now);
      startOfThisWeek.setDate(now.getDate() - now.getDay()); // Sunday
      const startOfLastWeek = new Date(startOfThisWeek);
      startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
      const endOfLastWeek = new Date(startOfThisWeek);
      endOfLastWeek.setDate(startOfThisWeek.getDate() - 1); // Saturday
      const lastWeekRecords = (records || []).filter(
        (rec: { date: string }) => {
          const recDate = new Date(rec.date);
          return recDate >= startOfLastWeek && recDate <= endOfLastWeek;
        }
      );
      // Group by day of week
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const grouped: Record<
        string,
        { Present: number; Absent: number; Off: number }
      > = {};
      lastWeekRecords.forEach((rec: { date: string; status: string }) => {
        const date = new Date(rec.date);
        const day = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
        if (!grouped[day]) grouped[day] = { Present: 0, Absent: 0, Off: 0 };
        if (rec.status === "Present") grouped[day].Present += 1;
        else if (rec.status === "Absent") grouped[day].Absent += 1;
        else grouped[day].Off += 1;
      });
      const chartData: AttendanceChartData[] = days.map((day) => ({
        name: day,
        Present: grouped[day]?.Present || 0,
        Absent: grouped[day]?.Absent || 0,
        Off: grouped[day]?.Off || 0,
      }));
      setAttendanceData(chartData);
      setAttendanceLoaded(true);
    }
    fetchAttendance();
  }, [session]);

  const allLoaded = attendanceLoaded && performanceLoaded;
  if (!allLoaded) return <Loading />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 ">
      <Card className="col-span-2 shadow-lg transition-transform transform hover:scale-105">
        <CardContent>
          <h2 className="text-lg font-bold mb-2">Last Week Attendance</h2>
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
      <Card className=" shadow-lg transition-transform transform hover:scale-105">
        <CardContent>
          <h2 className="text-lg font-bold mb-2">
            Latest Performance Overview
          </h2>
          {!performanceLoaded ? (
            <div className="flex flex-col gap-2 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ) : performance ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Date:</span>
                <span className="text-gray-900">{performance.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Rating:</span>
                <span className="text-yellow-500 font-bold">
                  {performance.rating} / 5
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">
                  Reviewed by:
                </span>
                <span className="text-blue-700 font-medium">
                  {performance.reviewer?.name || "N/A"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Feedback:</span>
                <p className="mt-1 text-gray-800 bg-gray-50 rounded p-2 border border-gray-100">
                  {performance.feedback}
                </p>
              </div>
            </div>
          ) : (
            <p>No performance data available.</p>
          )}
        </CardContent>
      </Card>
      <Card className="shadow-lg transition-transform transform hover:scale-105">
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Available Leave
          </h3>
          <strong className="text-2xl text-gray-900">
            {leaveSummary.available}
          </strong>
        </div>
      </Card>
      <Card className="shadow-lg transition-transform transform hover:scale-105">
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">Taken Leave</h3>
          <strong className="text-2xl text-gray-900">
            {leaveSummary.taken}
          </strong>
        </div>
      </Card>
      <Card className="shadow-lg transition-transform transform hover:scale-105">
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">Annual Leave</h3>
          <strong className="text-2xl text-gray-900">
            {leaveSummary.annual}
          </strong>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
