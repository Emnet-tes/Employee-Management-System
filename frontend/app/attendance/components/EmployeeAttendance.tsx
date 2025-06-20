"use client";

import React, { useEffect,useState } from "react";
import { Attendance } from "@/types/attendance";
import { calculateWorkHours } from "@/app/utils/utils";
import { getAttendancesByEmployeeId } from "@/lib/sanity/utils/attendance";

interface Props {
  employeeId: string;
}

export default function EmployeeAttendance({ employeeId }: Props) {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getAttendancesByEmployeeId(employeeId);
        setAttendances(result || []);
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [employeeId]);

  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = attendances.find((a) => a.date === today);

  async function handleCheckIn() {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().slice(0, 5);
    const checkIn = `${date} ${time}`;

    if (todayAttendance) {
      alert("You already checked in today");
      return;
    }

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          date,
          checkIn,
          checkOut: null,
          status: "Present",
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const newAttendance = await res.json();
      setAttendances((prev) => [...prev, newAttendance]);
    } catch (err) {
      console.error("Check-in error:", err);
      alert("Failed to check in.");
    }
  }

  async function handleCheckOut() {
    if (!todayAttendance) {
      alert("Please check in first.");
      return;
    }
    if (todayAttendance.checkOut) {
      alert("Already checked out.");
      return;
    }

    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().slice(0, 5);
    const checkOut = `${date} ${time}`;

    try {
      const res = await fetch(`/api/attendance/${todayAttendance._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: todayAttendance.date,
          employeeId,
          checkIn: todayAttendance.checkIn,
          checkOut,
          status: "Present",
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const updated = await res.json();
      setAttendances((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a))
      );
    } catch (err) {
      console.error("Check-out error:", err);`3`
      alert("Failed to check out.");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Attendance</h1>
      <div className="bg-white rounded shadow p-4 mb-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="text-lg font-semibold">Today: {today}</div>
          <div>
            Status:{" "}
            <span
              className={
                todayAttendance?.status === "Present"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {todayAttendance?.status || "-"}
            </span>
          </div>
          <div>
            Check-In:{" "}
            {todayAttendance?.checkIn || (
              <span className="text-gray-400">Not checked in</span>
            )}
          </div>
          <div>
            Check-Out:{" "}
            {todayAttendance?.checkOut || (
              <span className="text-gray-400">Not checked out</span>
            )}
          </div>
          <div>
            Work Hours:{" "}
            {calculateWorkHours(
              todayAttendance?.checkIn ?? undefined,
              todayAttendance?.checkOut ?? undefined
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            className={`px-4 py-2 rounded ${todayAttendance?.checkIn ? "bg-gray-300 text-gray-500" : "bg-green-600 text-white"}`}
            onClick={handleCheckIn}
            disabled={!!todayAttendance?.checkIn}
          >
            {todayAttendance?.checkIn ? "Checked In" : "Check In"}
          </button>
          <button
            className={`px-4 py-2 rounded ${!todayAttendance?.checkIn || todayAttendance?.checkOut ? "bg-gray-300 text-gray-500" : "bg-blue-600 text-white"}`}
            onClick={handleCheckOut}
            disabled={!todayAttendance?.checkIn || !!todayAttendance?.checkOut}
          >
            {todayAttendance?.checkOut ? "Checked Out" : "Check Out"}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Check-In</th>
              <th className="border px-2 py-1">Check-Out</th>
              <th className="border px-2 py-1">Work Hours</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendances.map((a) => (
              <tr key={a._id} className="text-center">
                <td className="border px-2 py-1">{a.date}</td>
                <td className="border px-2 py-1">{a.checkIn || "-"}</td>
                <td className="border px-2 py-1">{a.checkOut || "-"}</td>
                <td className="border px-2 py-1">
                  {calculateWorkHours(
                    a.checkIn ?? undefined,
                    a.checkOut ?? undefined
                  )}
                </td>
                <td className="border px-2 py-1">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
