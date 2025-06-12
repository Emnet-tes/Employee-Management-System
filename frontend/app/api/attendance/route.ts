import { NextRequest, NextResponse } from "next/server";
import { createAttendance } from "@/lib/sanity/utils/attendance";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const attendance = await createAttendance(data);
  return NextResponse.json(attendance);
}
