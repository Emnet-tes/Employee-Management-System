import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const PerformancePage = async () => {
  const session = await auth();
  const role = session?.user?.role;
  const employeeId = session?.user?.employeeId;
  // let userData = null;

  // if (employeeId) {
  //   console.log("Fetching user data for employee ID:", employeeId);
  //   const res = await fetch(`${process.env.NEXTAUTH_URL}/api/employee/${employeeId}`);

  //   if (res.ok) {
  //     userData = await res.json();
  //     console.log("User data:", userData);
  //   }
  // }

  if (role === "admin") {
    const { default: AdminPerformancePage } = await import(
      "./performanceClient"
    );
    return <AdminPerformancePage />;
  } else if (role === "manager") {
    const { default: ManagerPerformancePage } = await import(
      "./ManagerPerformancePage"
    );
    return <ManagerPerformancePage session={session} />;
  } else if (role === "employee") {
    const { default: EmployeePerformancePage } = await import(
      "./EmployeePerformancePage"
    );
    return <EmployeePerformancePage session={session} />;
  } else {
    redirect("/login");
  }
};

export default PerformancePage;
