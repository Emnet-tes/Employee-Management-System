
import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";



const AttendancePage = async() => {
  const session = await auth();
  const role = session?.user?.role;
  
  if (!role ) {
    console.log("Unauthorized access attempt by role:", role);
    redirect("/login");
  }
  else if (role === "admin") {
    const { default: AdminAttendance } = await import("./components/AdminAttendance");
    return <AdminAttendance />;
  }
  else if (role === "employee" && session?.user?.id) {
    const { default: EmployeeAttendance } = await import("./components/EmployeeAttendance");
    return <EmployeeAttendance userId={session?.user?.id} />;
  }
  else{
    const { default: ManagerAttendance } = await import("./components/ManagerAttendance");
    return <ManagerAttendance managerId={session?.user?.id} />;
  }
};

export default AttendancePage;
