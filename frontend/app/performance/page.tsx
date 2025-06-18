import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const PerformancePage = async () => {
  const session = await auth();
  const role = session?.user?.role;

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
