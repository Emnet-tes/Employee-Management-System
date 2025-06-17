import { NextRequest, NextResponse } from "next/server";
import { getEmployeeById, updateEmployee, deleteEmployee } from "@/lib/sanity/utils/employee";

// GET: Get employee by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const employee = await getEmployeeById(params.id);
  if (!employee) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(employee);
}

// PATCH: Update employee by ID
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const updates = await req.json();
  const updated = await updateEmployee(params.id, updates);
  return NextResponse.json(updated);
}

// DELETE: Delete employee by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const deleted = await deleteEmployee(params.id);
  return NextResponse.json(deleted);
}
