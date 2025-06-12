import React from "react";
import { getAllSchedules } from "@/lib/sanity/utils/schedule";
import { Schedule } from "@/types/schedule";

const page = async () => {
  const schedules: Schedule[] = await getAllSchedules();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Schedule</h1>
      <p className="mt-4 text-lg">Welcome to the schedule page!</p>
      <p className="mt-2 text-sm text-gray-500">
        This is where you can view and manage employee schedules.
      </p>
      <div className="mt-6 w-full max-w-2xl">
        {schedules.map((schedule) => (
          <div key={schedule._id} className="mb-4 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">{schedule.employee.name}</h2>
            <p>Shift: {schedule.shift}</p>
            <p>Date: {new Date(schedule.date).toLocaleDateString()}</p>
            {schedule.notes && <p>Notes: {schedule.notes}</p>}
          </div>
        ))}
      </div>
    </main>
  );
};

export default page;
