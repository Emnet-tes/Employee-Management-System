import { NextRequest, NextResponse } from "next/server";
import {
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} from "@/lib/sanity/utils/schedule";

// GET: Get a schedule by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const schedule = await getScheduleById(id);
  if (!schedule) {
    return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
  }
  return NextResponse.json(schedule);
}

// PATCH: Update a schedule by ID
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const updates = await req.json();
  const updated = await updateSchedule(id, updates);
  return NextResponse.json(updated);
}

// DELETE: Delete a schedule by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const deleted = await deleteSchedule(id);
  return NextResponse.json(deleted);
}
