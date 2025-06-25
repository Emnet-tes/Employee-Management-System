import React from "react";
import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import { auth } from "@/lib/auth";



const DashboardPage = async () => {
  const session = await auth();
  const role = session?.user?.role;

  if (!session || !role) return <div>Loading...</div>;

  return (
    <div className="p-4">
      {role === "admin" && <AdminDashboard />}
      {role === "manager" && session?.user?.employeeId && (
        <ManagerDashboard
          session={session as { user: { employeeId: string } }}
        />
      )}
      {role === "employee" && <EmployeeDashboard session={session as { user: { employeeId: string } }} />}
    </div>
  );
};

export default DashboardPage;
