
import React from "react";
import EmployeeAttendance from "./components/EmployeeAttendance";
import AdminAttendance from "./components/AdminAttendance";



// TODO: Replace this mock with real role and ID from session/auth logic
const MOCK_ROLE:   "employee"|"admin" = "admin"; // Change to "admin" to test admin view
const MOCK_EMPLOYEE_ID = "4a94372b-cf18-409b-a3b9-7e9bba255fd1";

const AttendancePage = async() => {

  return (
    <div className="p-4 text-black">
      {/* <EmployeeAttendance employeeId="4a94372b-cf18-409b-a3b9-7e9bba255fd1" /> */}
      {MOCK_ROLE === "admin" ? (
        <AdminAttendance />
      ) : (
        <EmployeeAttendance
          employeeId={MOCK_EMPLOYEE_ID}
         
        />
      )}
    </div>
  );
};

export default AttendancePage;
