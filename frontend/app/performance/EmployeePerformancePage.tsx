"use client";

import React, { useEffect, useState } from "react";
import { Performance } from "@/types/performance";
import Loading from "../_component/Loading";

interface Props {
  session: {
    user: {
      employeeId: string;
    };
  };
}

const EmployeePerformancePage: React.FC<Props> = ({ session }) => {
  const [reviews, setReviews] = useState<Performance[]>([]) || [];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeReviews = async () => {
      if (!session?.user?.employeeId) {
        setLoading(false); 
        return;
      }

      try {
        console.log(
          "main Fetching employee performance data for:",
          session.user.employeeId
        );
        const res = await fetch(
          `/api/performance?employeeId=${session.user.employeeId}`
        );
        const data = await res.json();
        console.log("Fetched employee performance data:", data);
        setReviews(data);
      } catch (error) {
        console.log("Error fetching employee performance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeReviews();
  }, [session]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-4 overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2 text-black">Reviewer</th>
            <th className="border px-4 py-2 text-black">Date</th>
            <th className="border px-4 py-2 text-black">Rating</th>
            <th className="border px-4 py-2 text-black">Goals</th>
            <th className="border px-4 py-2 text-black">KPIs</th>
            <th className="border px-4 py-2 text-black">Feedback</th>
          </tr>
        </thead>
        <tbody>
          {reviews?.map((review) => (
            <tr key={review._id} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-black">
                {review?.reviewer?.name}
              </td>
              <td className="border px-4 py-2 text-black">
                {new Date(review.date).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2 text-black">
                {review.rating} / 10
              </td>
              <td className="border px-4 py-2 text-black">
                <ul className="list-disc list-inside text-black">
                  {review?.goals?.map((goal, idx) => (
                    <li key={idx} className="text-black">
                      {goal}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="border px-4 py-2 text-black">
                <ul className="list-disc list-inside text-black">
                  {review?.kpis?.map((kpiObj, idx) => (
                    <li key={idx} className="text-black">
                      {kpiObj.kpi} - Target: {kpiObj.target}, Achieved:{" "}
                      {kpiObj.achieved}
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

export default EmployeePerformancePage;
