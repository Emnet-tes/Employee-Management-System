import { deleteAttendance } from "@/lib/sanity/utils/attendance";
import { NextRequest } from "next/server";

export async function DELETE(
  _: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = await context;
  const { id } = await params;
  await deleteAttendance(id);
  return new Response("Attendance deleted successfully", { status: 200 });
}
