import {
  deleteAttendance,
  updateAttendance,
} from "@/lib/sanity/utils/attendance";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/attendance/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteAttendance(params.id);
    return new Response("Attendance deleted successfully", { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/attendance/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const data = await req.json();
    const updated = await updateAttendance(id, data);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
