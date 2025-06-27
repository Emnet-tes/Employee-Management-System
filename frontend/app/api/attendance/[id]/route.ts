import {
  updateAttendance,
} from "@/lib/sanity/utils/attendance";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/attendance/[id]
// export async function DELETE(
//   _: NextRequest,
//   context: { params: { id: string } } | Promise<{ params: { id: string } }>
// ) {
//   const { params } = await context;
//   const { id } = await params;
//   await deleteAttendance(id);
//   return new Response("Attendance deleted successfully", { status: 200 });
// }

// PATCH /api/attendance/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const data = await req.json();
    const updated = await updateAttendance(params.id, data);
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
