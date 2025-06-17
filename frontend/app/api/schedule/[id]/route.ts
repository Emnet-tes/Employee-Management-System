import { NextRequest, NextResponse } from "next/server";
import {
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} from "@/lib/sanity/utils/schedule";

// GET: Get a schedule by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const schedule = await getScheduleById(params.id);
  if (!schedule) {
    return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
  }
  return NextResponse.json(schedule);
}

// PATCH: Update a schedule by ID
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const updates = await req.json();
  const updated = await updateSchedule(params.id, updates);
  return NextResponse.json(updated);
}

// DELETE: Delete a schedule by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const deleted = await deleteSchedule(params.id);
  return NextResponse.json(deleted);
}
