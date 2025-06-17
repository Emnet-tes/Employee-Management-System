import { NextRequest, NextResponse } from "next/server";
import { createSchedule, getAllSchedules } from "@/lib/sanity/utils/schedule";

// GET: Get all schedules
export async function GET() {
  const schedules = await getAllSchedules();
  return NextResponse.json(schedules);
}

// POST: Create a new schedule
export async function POST(req: NextRequest) {
  const data = await req.json();
  const newSchedule = await createSchedule(data);
  return NextResponse.json(newSchedule);
}
