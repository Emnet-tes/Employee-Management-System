"use client";
import {
  getEmployees,
  getEmployeesByUserId,
} from "@/lib/sanity/utils/employee";
import { redirect } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Loading from "../_component/Loading";
import { Employee } from "@/types/employee";
import { getEmployeeColumns } from "./components/EmployeeColumns";
import Table from "../_component/Table";




export default function ManagerEmployeesPage({ id }: { id: string }) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

    const columns = useMemo(
      () =>
        getEmployeeColumns(
          {showActions: false 

          }),
      []
    );

  useEffect(() => {
    async function fetchData() {
      if (!id) {
        redirect("/dashboard");

      }
      setLoading(true);
      // Fetch manager's employee record
      const managerEmployee = await getEmployeesByUserId(id);
      const managerDept =
        managerEmployee?.department?._id ;

      // Fetch all employees
      const allEmployees = await getEmployees();
      // Filter by department
      const filtered = allEmployees.filter(
        (e:Employee) =>
          e.department?._id === managerDept 
      );
      console.log("Filtered Employees:", filtered);
      setEmployees(filtered);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <Loading/>
  }

  return (
    <div className="container mx-auto p-6 text-black">
      <h1 className="text-2xl font-bold mb-6">Employee Management</h1>
      { employees.length === 0 ? (
        <p className="text-gray-500">No employees found in your department.</p>):<Table data={employees} columns={columns} />}
      
    </div>
  );
}
