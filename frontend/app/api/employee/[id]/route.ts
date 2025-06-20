import { NextRequest, NextResponse } from "next/server";
import {
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "@/lib/sanity/utils/employee";

// GET: Get employee by ID
export async function GET(
  req: NextRequest,
  context: Promise<{ params: { id: string } }>
) {
  try {
  const { params } = await context;
  const { id: employeeId } = await params; 

  const employee = await getEmployeeById(employeeId);
   return NextResponse.json(employee);
  }
  catch (error) {
    console.log("Error fetching employee:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

 
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
