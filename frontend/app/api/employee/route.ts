import { NextRequest, NextResponse } from "next/server";
import { createEmployee, getEmployees } from "@/lib/sanity/utils/employee";

// GET: Get all employees
export async function GET() {
  const employees = await getEmployees();
  return NextResponse.json(employees);
}

// POST: Create a new employee
export async function POST(req: NextRequest) {
  const data = await req.json();
  const employee = await createEmployee(data);
  return NextResponse.json(employee);
}
