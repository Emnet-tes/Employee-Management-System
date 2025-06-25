"use client";

import React, { useEffect, useState } from "react";
import { Performance } from "@/types/performance";
import AddReviewModal from "@/component/AddReviewModal";
import { getEmployees } from "@/lib/sanity/utils/employee";
import { Employee } from "@/types/employee";
import Loading from "../_component/Loading";

interface Props {
  session: {
    user: {
      employeeId: string;
    };
  };
}

const ManagerPerformancePage: React.FC<Props> = ({ session }) => {
  const [reviews, setReviews] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentEmployees, setDepartmentEmployees] = useState<Employee[]>(
    []
  );

  useEffect(() => {
    const fetchEmployees = async () => {
      const employees = await getEmployees();
      const manager = employees.find(
        (emp) => emp._id === session.user.employeeId
      );
      const departmentEmployees = employees.filter(
        (emp) =>
          emp.department?.name === manager?.department.name &&
          emp.role.title !== "manager" &&
          emp.role.title !== "admin"
      );
      setDepartmentEmployees(departmentEmployees);
      // You can now use departmentEmployees as needed
      console.log("Department Employees:", departmentEmployees);
      console.log("Manager:", manager?.department?.name);
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.employeeId) return;
      try {
        const res = await fetch(
          `/api/performance?reviewerId=${session.user.employeeId}`
        );
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Failed to load performance data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (loading) return <Loading />;

  if (reviews.length === 0) {
    return <Loading />;
  }

  return (
    <div className="p-4 overflow-auto">
      <AddReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employeeId={session.user.employeeId}
        employees={departmentEmployees}
      />
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Add Review
        </button>
      </div>
      <table className="min-w-full table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2 text-black">Employee</th>
            <th className="border px-4 py-2 text-black">Date</th>
            <th className="border px-4 py-2 text-black">Rating</th>
            <th className="border px-4 py-2 text-black">Goals</th>
            <th className="border px-4 py-2 text-black">KPIs</th>
            <th className="border px-4 py-2 text-black">Feedback</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-black">
                {review?.employee?.name}
              </td>
              <td className="border px-4 py-2 text-black">
                {new Date(review?.date).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2 text-black">
                {review.rating} / 10
              </td>
              <td className="border px-4 py-2 text-black">
                <ul className="list-disc list-inside text-black">
                  {review?.goals?.map((goal, index) => (
                    <li key={index} className="text-black">
                      {goal}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="border px-4 py-2 text-black">
                <ul className="list-disc list-inside text-black">
                  {review?.kpis?.map((kpi, index) => (
                    <li key={index} className="text-black">
                      {kpi.kpi} - Target: {kpi.target}, Achieved: {kpi.achieved}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="border px-4 py-2 text-black">{review.feedback}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerPerformancePage;
