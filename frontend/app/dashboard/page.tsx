import React from "react";
import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import { auth } from "@/lib/auth";

const DashboardPage = async () => {
  const session = await auth(); 
  const role = session?.user?.role;

  if (!role) return <div>Loading...</div>;

  return (
    <div className="p-4">
      {role === "admin" && <AdminDashboard session={session} />}
      {role === "manager" && <ManagerDashboard session={session} />}
      {role === "employee" && <EmployeeDashboard session={session} />}
    </div>
  );
};

export default DashboardPage;
