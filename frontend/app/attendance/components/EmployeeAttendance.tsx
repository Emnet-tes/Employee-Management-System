"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Attendance } from "@/types/attendance";
import { calculateWorkHours } from "@/app/utils/utils";
import { getEmployeeById, getEmployeesByUserId } from "@/lib/sanity/utils/employee";
import { getAttendancesByEmployeeId } from "@/lib/sanity/utils/attendance";
import Loading from "@/app/_component/Loading";
import { getAttendanceColumns } from "./AttendanceColums";
import Table from "@/app/_component/Table";

interface Props {
  userId: string;
}

export default function EmployeeAttendance({ userId }: Props) {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [employeeId, setEmployeeId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const employee = await getEmployeesByUserId(userId);
        const id = employee?._id;
        setEmployeeId(id);
        if (id) {
          const result = await getAttendancesByEmployeeId(id);
          setAttendances(result || []);
        }
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  const colums = useMemo(() => getAttendanceColumns(), []);

  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = attendances.find((a) => a.date === today);

  async function refreshAttendance() {
    if (employeeId) {
      const updated = await getAttendancesByEmployeeId(employeeId);
      setAttendances(updated || []);
    }
  }

  async function handleCheckIn() {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().slice(0, 5);
    const checkIn = `${date} ${time}`;

    if (todayAttendance) {
      alert("You already checked in today");
      return;
    }

    setSubmitting(true);
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

      await refreshAttendance();
    } catch (err) {
      console.error("Check-in error:", err);
      alert("Failed to check in.");
    } finally {
      setSubmitting(false);
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

    setSubmitting(true);
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
      const employee = await getEmployeeById(employeeId);
      if(employee?.employmentStatus === "on_leave") {
      try{
        await fetch(`/api/employee/${employeeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employmentStatus: "active" }),
        });
      }catch(err) {
        console.error("Failed to update employee status", err);
        alert("Failed to update employee status.");}
      }
      await refreshAttendance();
    } catch (err) {
      console.error("Check-out error:", err);
      alert("Failed to check out.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="text-black gap-6 flex flex-col">
      <div className="bg-white rounded shadow p-4 mb-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="text-lg font-semibold">Today: {today}</div>
          <div>
            Status:
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
            Check-In:
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
            className={`px-4 py-2 rounded not-disabled:cursor-pointer ${todayAttendance?.checkIn ? "bg-gray-300 text-gray-500" : "bg-green-600 text-white"}`}
            onClick={handleCheckIn}
            disabled={!!todayAttendance?.checkIn || submitting}
          >
            {submitting && !todayAttendance?.checkIn
              ? "Checking In..."
              : todayAttendance?.checkIn
                ? "Checked In"
                : "Check In"}
          </button>
          <button
            className={`px-4 py-2 rounded not-disabled:cursor-pointer ${!todayAttendance?.checkIn || todayAttendance?.checkOut ? "bg-gray-300 text-gray-500" : "bg-blue-600 text-white"}`}
            onClick={handleCheckOut}
            disabled={
              !todayAttendance?.checkIn ||
              !!todayAttendance?.checkOut ||
              submitting
            }
          >
            {submitting && !todayAttendance?.checkOut
              ? "Checking Out..."
              : todayAttendance?.checkOut
                ? "Checked Out"
                : "Check Out"}
          </button>
        </div>
      </div>
      <h1 className="text-2xl font-bold ">My Attendance</h1>
      {attendances.length === 0 ? ( <div className="text-center text-gray-500 py-4">
        No Attendace records found.
      </div>):<Table data={attendances} columns={colums}  />}
      
    </div>
  );
}
