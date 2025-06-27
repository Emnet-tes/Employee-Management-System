import { NextRequest, NextResponse } from "next/server";
import { deleteDepartment, getDepartmentById, updateDepartment } from "@/lib/sanity/utils/department";

// GET: Get employee by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const employee = await getDepartmentById(id);
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
  const updated = await updateDepartment(id, updates);
  return NextResponse.json(updated);
}

// DELETE: Delete employee by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const deleted = await deleteDepartment(id);
  return NextResponse.json(deleted);
}
