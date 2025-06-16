"use client";
import React, { useEffect, useState } from "react";
import { getAllSchedules, createSchedule } from "@/lib/sanity/utils/schedule";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/component/card";
import { Schedule } from "@/types/schedule";

const SchedulePage = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [formData, setFormData] = useState({
    employeeId: "",
    shift: "",
    date: "",
    notes: "",
  });

  useEffect(() => {
    async function loadSchedules() {
      const data = await getAllSchedules();
      setSchedules(data);
    }
    loadSchedules();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await createSchedule(formData);
    alert("Schedule created!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* ---------------------------------------------
          ADMIN & MANAGER VIEW: Form to Assign Schedules
         --------------------------------------------- */}
      {/* TODO: Show this form only if role === 'admin' || 'manager' */}
      <Card>
        <CardContent>
          <h2 className="font-bold mb-2">Assign Work Schedule</h2>
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              placeholder="Employee ID"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="border p-2 w-full"
            />
            <input
              type="text"
              placeholder="Shift"
              value={formData.shift}
              onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
              className="border p-2 w-full"
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="border p-2 w-full"
            />
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="border p-2 w-full"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Save
            </button>
          </form>
        </CardContent>
      </Card>

      {/* -------------------------------------------------------
          ADMIN, MANAGER & EMPLOYEE VIEW: View Scheduled Shifts
         ------------------------------------------------------- */}
      {/* TODO: For employees, filter: schedules.filter(s => s.employee._ref === currentUserId) */}
      <Card>
        <CardContent>
          <h2 className="font-bold mb-2">Scheduled Shifts</h2>
          <table className="w-full text-left border">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Shift</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((sched: any) => (
                <tr key={sched._id}>
                  <td>{sched.date}</td>
                  <td>{sched.employee?.name || "N/A"}</td>
                  <td>{sched.shift}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* -------------------------------
          Optional: Timesheet Bar Chart
         ------------------------------- */}
      {/* Visible to all roles but you may limit by role later */}
      <Card className="col-span-2">
        <CardContent>
          <h2 className="font-bold mb-2">Timesheet Overview</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={schedules.map((s) => ({
                date: s.date,
                value: 1,
                label: s.shift,
              }))}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulePage;
