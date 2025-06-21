"use client";
import { useEffect, useState } from "react";
import { getAllSchedules, createSchedule } from "@/lib/sanity/utils/schedule";
import { getEmployees } from "@/lib/sanity/utils/employee";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/component/card";
import { Schedule } from "@/types/schedule";
import { Employee } from "@/types/employee";
import AssignScheduleModal from "@/component/AssignScheduleModal";

export default function ClientSchedulePage({ session }: { session: any }) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departmentEmployees, setDepartmentEmployees] = useState<Employee[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    shift: "",
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
  });

  useEffect(() => {
    async function loadSchedules() {
      const data = await getAllSchedules();
      setSchedules(data);
    }
    async function loadEmployees() {
      const data = await getEmployees();
      setEmployees(data);
      if (session?.user?.role === "manager") {
        const manager = data.find((emp) => emp._id === session.user.employeeId);
        const deptEmps = data.filter(
          (emp) =>
            emp.department?.name === manager?.department?.name &&
            emp.role.title !== "manager" &&
            emp.role.title !== "admin"
        );
        setDepartmentEmployees(deptEmps);
      }
    }
    loadSchedules();
    loadEmployees();
  }, [session]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await createSchedule(formData);
    alert("Schedule created!");
    setFormData({
      employeeId: "",
      shift: "",
      date: "",
      startTime: "",
      endTime: "",
      notes: "",
    });
    getAllSchedules().then(setSchedules);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <Card>
        <CardContent>
          <h2 className="font-bold mb-2">Scheduled Shifts</h2>
          <table className="w-full text-left border">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Shift</th>
                <th>Start</th>
                <th>End</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((sched: any) => (
                <tr key={sched._id}>
                  <td>{sched.date}</td>
                  <td>{sched.employee?.name || "N/A"}</td>
                  <td>{sched.shift}</td>
                  <td>{sched.startTime}</td>
                  <td>{sched.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {(session?.user?.role === "admin" ||
        session?.user?.role === "manager") && (
        <div className="flex justify-end max-h-12">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            Assign Schedule
          </button>
          <AssignScheduleModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            employees={
              session?.user?.role === "manager"
                ? departmentEmployees
                : employees
            }
            onSuccess={() => {
              getAllSchedules().then(setSchedules);
            }}
          />
        </div>
      )}

      <Card className="col-span-2">
        <CardContent>
          <h2 className="font-bold mb-4 text-lg">Timesheet Overview</h2>
          <div className="w-full flex flex-col md:flex-row gap-6">
            <div className="flex-1 min-w-[300px]">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={
                    // Group by date and shift for stacked/grouped bars
                    Object.values(
                      schedules.reduce((acc: any, s) => {
                        const key = s.date;
                        if (!acc[key]) acc[key] = { date: s.date };
                        acc[key][s.shift] = (acc[key][s.shift] || 0) + 1;
                        return acc;
                      }, {})
                    )
                  }
                  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  {/* Dynamically render a Bar for each shift type */}
                  {Array.from(new Set(schedules.map((s) => s.shift))).map(
                    (shift, idx) => (
                      <Bar
                        key={shift}
                        dataKey={shift}
                        stackId="a"
                        fill={
                          ["#60a5fa", "#34d399", "#fbbf24", "#f87171"][idx % 4]
                        }
                        name={shift}
                        radius={[4, 4, 0, 0]}
                      />
                    )
                  )}
                  {/* Legend */}
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 flex-wrap">
                {Array.from(new Set(schedules.map((s) => s.shift))).map(
                  (shift, idx) => (
                    <div key={shift} className="flex items-center gap-2">
                      <span
                        className="inline-block w-4 h-4 rounded"
                        style={{
                          backgroundColor: [
                            "#60a5fa",
                            "#34d399",
                            "#fbbf24",
                            "#f87171",
                          ][idx % 4],
                        }}
                      />
                      <span className="text-sm text-black">{shift}</span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="flex-1 min-w-[220px]">
              <h3 className="font-semibold mb-2 text-black">Upcoming Shifts</h3>
              <ul className="divide-y divide-gray-200 bg-gray-50 rounded p-2">
                {schedules
                  .filter((s) => new Date(s.date) >= new Date())
                  .sort(
                    (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                  )
                  .slice(0, 5)
                  .map((s, idx) => (
                    <li key={idx} className="py-2 flex flex-col">
                      <span className="text-black font-medium">
                        {s.employee?.name || "N/A"}
                      </span>
                      <span className="text-xs text-gray-600">
                        {s.date} &mdash; {s.shift} ({s.startTime} - {s.endTime})
                      </span>
                    </li>
                  ))}
                {schedules.filter((s) => new Date(s.date) >= new Date())
                  .length === 0 && (
                  <li className="py-2 text-gray-400 text-sm">
                    No upcoming shifts
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
