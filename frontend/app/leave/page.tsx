import { auth } from "@/lib/auth";
import { getEmployeesByUserId } from "@/lib/sanity/utils/employee";
import { redirect } from "next/navigation";


export default async function LeavesPage() {
  const session = await auth();
  const id = session?.user?.id;
  const role = session?.user?.role;

  if (!id) {
    console.log("Unauthorized access attempt by user ID:", id);
    return redirect("/login");
  }
  const departmentId = await (await getEmployeesByUserId(id)).department._id;
  if (role == "employee") {
     const employee = await getEmployeesByUserId(id)
      const employeeId = employee?._id ;
    const { default: EmployeeLeave } = await import("./components/EmployeeLeave");
    return <EmployeeLeave employeeId={employeeId} departmentId={departmentId}/>;
  }
  else if (role == "admin") {
    const { default: AdminLeave } = await import("./components/AdminLeave");
    return <AdminLeave />;
  }
  else{
    const { default: ManagerLeave } = await import("./components/ManagerLeave");
    return <ManagerLeave managerId={id} departmentId={departmentId}/>;
  }
}
