"use client";

import { useState } from "react";
import DepartmentTab from "./DepartmentTab";
import EmployeeTab from "./EmployeeTab";

export default function AdminEmployeesPage() {
  const [activeTab, setActiveTab] = useState<"employees" | "departments">(
    "employees"
  );

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-6">Employee Management</h1>
      {/* Tabs */}
      <div className="flex mb-6">
        <button
          className={`px-4 py-2 rounded-t-lg mr-2 ${activeTab === "employees" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("employees")}
        >
          Employees
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg ${activeTab === "departments" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("departments")}
        >
          Departments
        </button>
      </div>
      {/* Tab Content */}
      {activeTab === "employees" && <EmployeeTab />}
      {activeTab === "departments" && <DepartmentTab />}
    </div>
  );
}
