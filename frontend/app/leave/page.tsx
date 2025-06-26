import { auth } from "@/lib/auth";
import { getEmployeesByUserId } from "@/lib/sanity/utils/employee";
import { redirect } from "next/navigation";

export default async function LeavesPage() {
  const session = await auth();
  const id = session?.user?.id;
  const role = session?.user?.role;

  if (!id || !role) {
    console.error("Unauthorized access attempt: No user ID or role found");
    return redirect("/login");
  }

  const employee = await getEmployeesByUserId(id);

  if (!employee) {
    console.error("Employee not found for ID:", id);
    return <div className="text-red-500 p-4">Error: Employee not found.</div>;
  }

  if (!employee.department || !employee.department._id) {
    console.error("Missing department info for employee ID:", id);
    return (
      <div className="text-red-500 p-4">Error: Department not assigned.</div>
    );
  }

  const departmentId = employee.department._id;
  const employeeId = employee._id;

  if (role === "employee") {
    const { default: EmployeeLeave } = await import(
      "./components/EmployeeLeave"
    );
    return (
      <EmployeeLeave employeeId={employeeId} departmentId={departmentId}  />
    );
  } else if (role === "admin") {
    const { default: AdminLeave } = await import("./components/AdminLeave");
    return <AdminLeave />;
  } else {
    const { default: ManagerLeave } = await import("./components/ManagerLeave");
    return <ManagerLeave managerId={id} departmentId={departmentId} />;
  }
}
