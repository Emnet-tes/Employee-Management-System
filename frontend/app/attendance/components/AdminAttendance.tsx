"use client";

import { Attendance } from "@/types/attendance";
import { Employee } from "@/types/employee";
import { Download, Edit2, Filter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { calculateWorkHours } from "@/app/utils/utils";
import { getAttendances } from "@/lib/sanity/utils/attendance";
import { getEmployees } from "@/lib/sanity/utils/employee";

export default function AdminAttendance() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    employee: "",
    department: "",
    status: "",
    from: "",
    to: "",
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [attendanceData, employeeData] = await Promise.all([
          getAttendances(),
          getEmployees(),
        ]);
        setAttendances(attendanceData || []);
        setEmployees(employeeData || []);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setAttendances([]);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredAttendances = useMemo(() => {
    return attendances.filter((a) => {
      if (filters.employee && a.employee._id !== filters.employee) return false;
      if (
        filters.department &&
        a.employee.department &&
        typeof a.employee.department === "object" &&
        a.employee.department.name !== filters.department
      )
        return false;
      if (filters.department && (!a.employee.department || typeof a.employee.department !== "object"))
        return false;
      if (filters.status && a.status !== filters.status) return false;
      if (filters.from && a.date < filters.from) return false;
      if (filters.to && a.date > filters.to) return false;
      return true;
    });
  }, [attendances, filters]);

  if (loading) {
    return (
      <div className="p-4 text-black">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading admin data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Attendance Overview (Admin)</h1>

      <div className="flex flex-wrap gap-2 mb-4 items-end">
        <div>
          <label className="block text-xs">Employee</label>
          <select
            className="border rounded px-2 py-1"
            value={filters.employee}
            onChange={(e) =>
              setFilters((f) => ({ ...f, employee: e.target.value }))
            }
          >
            <option value="">All</option>
            {employees.map((emp, index) => (
              <option key={index} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs">Department</label>
          <select
            className="border rounded px-2 py-1"
            value={filters.department}
            onChange={(e) =>
              setFilters((f) => ({ ...f, department: e.target.value }))
            }
          >
            <option value="">All</option>
            {[
              ...new Map(
                employees
                  .filter((e) => e.department && typeof e.department === "object")
                  .map((e) => [
                    e.department._id || e.department.name || "Unknown",
                    e.department.name || "Unknown",
                  ])
              ).entries(),
            ].map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs">Status</label>
          <select
            className="border rounded px-2 py-1"
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value }))
            }
          >
            <option value="">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
        <div>
          <label className="block text-xs">From</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={filters.from}
            onChange={(e) =>
              setFilters((f) => ({ ...f, from: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-xs">To</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={filters.to}
            onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
          />
        </div>
        <button className="ml-4 flex items-center gap-1 bg-gray-200 px-3 py-1 rounded text-sm">
          <Filter size={16} /> Filter
        </button>
        <button className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded text-sm">
          <Download size={16} /> Export PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Department</th>
              <th className="border px-2 py-1">Check-In</th>
              <th className="border px-2 py-1">Check-Out</th>
              <th className="border px-2 py-1">Total Work Hours</th>
              <th className="border px-2 py-1">Status</th>
             
            </tr>
          </thead>
          <tbody>
            {filteredAttendances.map((a, index) => (
              <tr key={index} className="text-center">
                <td className="border px-2 py-1">{a.date}</td>
                <td className="border px-2 py-1">{a.employee.name}</td>
                <td className="border px-2 py-1">
                  {typeof a.employee.department === "string"
                    ? a.employee.department
                    : a.employee.department?.name || "-"}
                </td>
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

      <div className="mt-6">
        <h2 className="font-semibold mb-2">Trends</h2>
        <ul className="list-disc ml-6 text-gray-700 text-sm">
          <li>3 employees were late more than 2 times this month</li>
          <li>2 absences recorded this week</li>
          <li>Average check-in time: 09:10 AM</li>
        </ul>
      </div>
    </div>
  );
}
