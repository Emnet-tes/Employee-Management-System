"use client";

import Loading from "@/app/_component/Loading";
import { getAttendances } from "@/lib/sanity/utils/attendance";
import {
  getEmployeesByUserId,
} from "@/lib/sanity/utils/employee";
import { Attendance } from "@/types/attendance";
import { useEffect, useMemo, useState } from "react";
import { getAttendanceColumns } from "./AttendanceColums";
import Table from "@/app/_component/Table";

interface Props {
  managerId: string;
}

export default function ManagerAttendance({ managerId }: Props) {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const lateThreshold = "09:00";
  const currentMonth = new Date().getMonth();

  const trends = {
    lateCounts: new Map<string, number>(),
    checkInTimes: [] as number[],
  };

  attendances.forEach(({ status, checkIn, date, employee }) => {
    const recordDate = new Date(date);
    if (recordDate.getMonth() !== currentMonth) return;

    if (status === "Present" && checkIn) {
      const hour = parseInt(checkIn.split(":")[0]);
      const minute = parseInt(checkIn.split(":")[1]);
      const timeValue = hour * 60 + minute;
      trends.checkInTimes.push(timeValue);

      if (checkIn > lateThreshold) {
        const name = employee?.name || "Unknown";
        trends.lateCounts.set(name, (trends.lateCounts.get(name) || 0) + 1);
      }
    }
  });

  const frequentlyLate = [...trends.lateCounts.entries()].filter(
    ([, count]) => count > 2
  );

  const avgCheckIn =
    trends.checkInTimes.length > 0
      ? (() => {
          const avg = Math.floor(
            trends.checkInTimes.reduce((a, b) => a + b, 0) /
              trends.checkInTimes.length
          );
          const h = String(Math.floor(avg / 60)).padStart(2, "0");
          const m = String(avg % 60).padStart(2, "0");
          return `${h}:${m}`;
        })()
      : "N/A";

  const colums = useMemo(()=> getAttendanceColumns(), []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [managerRecord, allAttendances] = await Promise.all(
          [getEmployeesByUserId(managerId), getAttendances()]
        );
        const managerDepartment = managerRecord?.department._id;
        const filteredByDept = allAttendances.filter((attendance) => 
         attendance.employee.department?._id == managerDepartment && attendance.employee._id  !== managerRecord._id );
        setAttendances(filteredByDept);
      } catch (error) {
        console.error("Error fetching manager data:", error);
        setAttendances([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [managerId]);

  if (loading) {
    return <Loading />;
  }
  if( attendances.length === 0 ) {
    return (
      <div className="text-center text-gray-500 py-4">
          No Attendace records found.
        </div>
    );
  }

  return (
    <div className="p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Attendance Overview (Manager)</h1>
      <Table data={attendances} columns={colums} enableFilters={true} />
      <div className="mt-6">
        <h2 className="font-semibold mb-2">Trends</h2>
        <ul className="list-disc ml-6 text-gray-700 text-sm">
          <li>
            {frequentlyLate.length} employees were late more than 2 times this
            month
          </li>
          <li>Average check-in time: {avgCheckIn}</li>
        </ul>
      </div>
    </div>
  );
}
