import { NextRequest, NextResponse } from "next/server";
import { createSchedule, getAllSchedules } from "@/lib/sanity/utils/schedule";
import { createNotification } from "@/lib/sanity/utils/notification";

// GET: Get all schedules
export async function GET() {
  const schedules = await getAllSchedules();
  return NextResponse.json(schedules);
}

// POST: Create a new schedule
export async function POST(req: NextRequest) {
  const data = await req.json();
  const newSchedule = await createSchedule(data);
   await createNotification({
    recipientId: data.employeeId, 
    type: "schedule",
    message: `You have been assigned a new schedule for ${data.date} (${data.shift})`,
  });
  return NextResponse.json(newSchedule);
}
