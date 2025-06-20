"use client";
import {
  getEmployees,
  getEmployeesByUserId,
} from "@/lib/sanity/utils/employee";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { buildImageUrl } from "./imageUrlBuilder";

export default function ManagerEmployeesPage({ id }: { id: string }) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) {
        redirect("/dashboard");
        return;
      }
      // Fetch manager's employee record
      const managerEmployee = await getEmployeesByUserId(id);
      const managerDept =
        managerEmployee?.department?._id || managerEmployee?.department; // adjust as per your data shape

      // Fetch all employees
      const allEmployees = await getEmployees();
      // Filter by department
      const filtered = allEmployees.filter(
        (e: any) =>
          e.department?._id === managerDept || e.department === managerDept
      );
      setEmployees(filtered);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Employees</h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <h2 className="text-2xl font-semibold p-6 border-b text-gray-700">
          Employee Directory
        </h2>

        <div className="divide-y">
          {employees.map((employee: any) => (
            <div
              key={employee._id}
              className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    employee.photo?.asset?._ref
                      ? buildImageUrl(employee.photo.asset._ref)
                      : "/loginImage.png"
                  }
                  alt="Employee"
                  className="w-16 h-16 rounded-full object-cover border shadow-sm"
                />

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {employee.name}
                  </h3>
                  <p className="text-sm text-gray-600">{employee.email}</p>
                  <p className="text-sm text-gray-600">{employee.phone}</p>
                </div>
              </div>

              <div className="text-sm text-gray-600 sm:text-right">
                <p>
                  <span className="font-medium text-gray-700">Role:</span>{" "}
                  {employee.role?.title || "N/A"}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Department:</span>{" "}
                  {employee.department?.name || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
