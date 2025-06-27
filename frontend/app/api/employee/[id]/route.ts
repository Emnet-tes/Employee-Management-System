import { NextRequest, NextResponse } from "next/server";
import {
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "@/lib/sanity/utils/employee";

// GET: Get employee by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    const employee = await getEmployeeById(id);
    return NextResponse.json(employee);
  } catch (error) {
    console.log("Error fetching employee:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



// PATCH: Update employee by ID
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const updates = await req.json();
  const updated = await updateEmployee(id, updates);
  return NextResponse.json(updated);
}

// DELETE: Delete employee by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const deleted = await deleteEmployee(id);
  return NextResponse.json(deleted);
}
