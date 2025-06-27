import { deleteUser, getUserById, updateUser } from "@/lib/sanity/utils/user";
import { NextRequest, NextResponse } from "next/server";

// GET: Get employee by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const employee = await getUserById(id);
  if (!employee)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(employee);
}

// PATCH: Update employee by ID
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const updates = await req.json();
  const updated = await updateUser(id, updates);
  return NextResponse.json(updated);
}
// DELETE: Delete employee by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const deleted = await deleteUser(id);
  return NextResponse.json(deleted);
}
