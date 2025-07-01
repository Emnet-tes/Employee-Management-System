"use client";

import { useEffect, useState } from "react";
import { getAllSchedules } from "@/lib/sanity/utils/schedule";
import { getEmployees } from "@/lib/sanity/utils/employee";
import { Card, CardContent } from "@/component/card";
import { Schedule } from "@/types/schedule";
import { Employee } from "@/types/employee";
import AssignScheduleModal from "@/component/AssignScheduleModal";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Loading from "../_component/Loading";

interface Props {
  session: {
    user: {
      employeeId: string;
      role: string;
    };
  };
}
export default function ClientSchedulePage({ session }: Props) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departmentEmployees, setDepartmentEmployees] = useState<Employee[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
    Promise.all([loadSchedules(), loadEmployees()]).finally(() =>
      setLoading(false)
    );
  }, [session]);

  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();
  //   await createSchedule(formData);
  //   alert("Schedule created!");
  //   setFormData({
  //     employeeId: "",
  //     shift: "",
  //     date: "",
  //     startTime: "",
  //     endTime: "",
  //     notes: "",
  //   });
  //   getAllSchedules().then(setSchedules);
  // };

  const filteredSchedules =
    session?.user?.role === "employee"
      ? schedules.filter((s) => s.employee?._id === session.user.employeeId)
      : schedules;

  const calendarEvents = filteredSchedules.map((sched) => ({
    title: `${sched.employee?.name || "N/A"} - ${sched.shift}`,
    date: sched.date,
  }));

  if (loading) return <Loading />;

  return (
    <div className="grid grid-cols-1 gap-4 p-4 text-black w-full overflow-x-auto">
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
      <Card className="w-full min-w-[320px]">
        <CardContent>
          <h2 className="font-bold mb-4 text-lg text-black">Shift Calendar</h2>
          <div className="w-full overflow-x-auto">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={calendarEvents}
              height={600}
              eventDisplay="block"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
